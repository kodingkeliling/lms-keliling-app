import { NextRequest, NextResponse } from "next/server";
import { validateMcpAuth } from "@/lib/mcp-auth";
import { executeTool, TOOLS_LIST, PROTECTED_TOOLS } from "@/lib/mcp-logic";

export const runtime = "nodejs";

// MCP Protocol version supported
const MCP_PROTOCOL_VERSION = "2024-11-05";

const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-protocol-version, mcp-session-id",
    "Access-Control-Expose-Headers": "Link, mcp-session-id"
};

function jsonRpcOk(id: any, result: any): NextResponse {
    return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? null, result },
        { headers: corsHeaders }
    );
}

function jsonRpcErr(
    id: any,
    code: number,
    message: string,
    data?: unknown,
    extraHeaders?: Record<string, string>
): NextResponse {
    const errorBody: Record<string, unknown> = { code, message };
    if (data !== undefined) errorBody.data = data;

    return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? null, error: errorBody },
        {
            status: code === -32001 ? 401 : 400,
            headers: { ...corsHeaders, ...(extraHeaders ?? {}) }
        }
    );
}

/**
 * GET — Health check endpoint.
 * Returns server metadata. SSE (server-push) is not supported in stateless mode.
 */
export async function GET(req: NextRequest) {
    const origin = new URL(req.url).origin;
    const accept = req.headers.get("accept") || "";

    // If client requests SSE, politely decline — we are stateless
    if (accept.includes("text/event-stream")) {
        return new NextResponse("SSE not supported in stateless mode. Use POST for JSON-RPC.", {
            status: 405,
            headers: {
                "Content-Type": "text/plain",
                Allow: "POST, OPTIONS",
                Link: `<${origin}/.well-known/oauth-protected-resource>; rel="blocked-by-auth"`,
                ...corsHeaders
            }
        });
    }

    return NextResponse.json(
        {
            name: "LMS Keliling MCP Server",
            version: "1.0.0",
            protocolVersion: MCP_PROTOCOL_VERSION,
            status: "active",
            capabilities: { tools: {} },
            endpoint: `${origin}/api/mcp`
        },
        {
            headers: {
                ...corsHeaders,
                Link: [
                    `<${origin}/.well-known/oauth-protected-resource>; rel="blocked-by-auth"`,
                    `<${origin}/.well-known/oauth-authorization-server>; rel="authorization_server"`
                ].join(", ")
            }
        }
    );
}

/**
 * POST — Stateless JSON-RPC 2.0 handler (no SDK transport layer).
 *
 * The MCP SDK's WebStandardStreamableHTTPServerTransport keeps an SSE stream
 * open indefinitely, which hangs Next.js serverless functions. We bypass it
 * and implement JSON-RPC 2.0 directly.
 *
 * Handles: initialize, notifications/initialized, ping, tools/list, tools/call
 */
export async function POST(req: NextRequest) {
    const origin = new URL(req.url).origin;

    // Resolve auth once per request
    const authHeader = req.headers.get("Authorization");
    const userId = await validateMcpAuth(authHeader);

    // Parse body
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: invalid JSON" } },
            { status: 400, headers: corsHeaders }
        );
    }

    // Batch request support
    if (Array.isArray(body)) {
        const responses = await Promise.all(
            body.map((item) => dispatch(item, userId, origin))
        );
        // Notifications produce null; filter them out
        const results = responses.filter((r) => r !== null);
        if (results.length === 0) {
            return new NextResponse(null, { status: 204, headers: corsHeaders });
        }
        // Build a combined JSON response for batch
        const payloads = await Promise.all(results.map((r) => (r as NextResponse).json()));
        return NextResponse.json(payloads, { headers: corsHeaders });
    }

    const response = await dispatch(body, userId, origin);
    // Notifications (no id) → 204 No Content
    if (response === null) {
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    }
    return response;
}

/**
 * Core JSON-RPC dispatcher.
 * Returns null for notifications (which must not have a response).
 */
async function dispatch(
    body: unknown,
    userId: string | null,
    origin: string
): Promise<NextResponse | null> {
    const req = body as Record<string, any>;
    const { method, id, params } = req;

    // Notification: id is absent or null → no response required
    const isNotification = id === undefined || id === null;

    switch (method) {
        // ── Lifecycle ────────────────────────────────────────────────────────
        case "initialize":
            return jsonRpcOk(id, {
                protocolVersion: "2024-11-05",
                capabilities: { tools: {} },
                serverInfo: { name: "LMS Keliling MCP Server", version: "1.0.0" }
            });

        case "notifications/initialized":
            return null; // fire-and-forget notification

        case "ping":
            if (isNotification) return null;
            return jsonRpcOk(id, {});

        // ── Tools ─────────────────────────────────────────────────────────────
        case "tools/list":
            return jsonRpcOk(id, { tools: TOOLS_LIST });

        case "tools/call": {
            const toolName: string = params?.name ?? "";
            const toolArgs: Record<string, unknown> = params?.arguments ?? {};

            // Lazy Auth: protected tools require authentication
            if (PROTECTED_TOOLS.includes(toolName) && !userId) {
                return jsonRpcErr(
                    id,
                    -32001,
                    "Unauthorized. Please authenticate to use this tool.",
                    {
                        login_url: `${origin}/oauth/authorize`,
                        authorization_endpoint: `${origin}/oauth/authorize`,
                        token_endpoint: `${origin}/api/oauth/token`
                    },
                    {
                        "WWW-Authenticate": `Bearer realm="LMS Keliling", resource_metadata="${origin}/.well-known/oauth-protected-resource"`
                    }
                );
            }

            try {
                const result = await executeTool(toolName, toolArgs, userId);
                return jsonRpcOk(id, result);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown error occurred";
                return jsonRpcOk(id, {
                    isError: true,
                    content: [{ type: "text", text: message }]
                });
            }
        }

        default:
            if (isNotification) return null; // unknown notifications are silently ignored
            return jsonRpcErr(id, -32601, `Method not found: ${method}`);
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}
