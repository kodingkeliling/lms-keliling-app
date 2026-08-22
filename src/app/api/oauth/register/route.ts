import { NextRequest, NextResponse } from "next/server";

/**
 * Dynamic Client Registration — RFC 7591
 *
 * Claude.ai and ChatGPT use this endpoint to register themselves as OAuth clients
 * before initiating the authorization flow. We accept any registration and return
 * a static public client (no client_secret — PKCE is required instead).
 */
export async function POST(req: NextRequest) {
    let body: Record<string, unknown> = {};
    try {
        body = await req.json();
    } catch {
        // allow empty or non-JSON body
    }

    const redirectUris: string[] = Array.isArray(body.redirect_uris)
        ? (body.redirect_uris as string[])
        : [];

    // RFC 7591 §3.2.1 — client registration response
    // NOTE: client_secret must be OMITTED (not null) for public clients.
    // Claude and GPT use Pydantic which rejects null as an invalid string.
    const response = NextResponse.json(
        {
            client_id: "lms-keliling-mcp-client",
            client_id_issued_at: Math.floor(Date.now() / 1000),
            client_name: body.client_name ?? "LMS Keliling MCP Client",
            redirect_uris: redirectUris,
            token_endpoint_auth_method: "none",
            grant_types: ["authorization_code", "refresh_token"],
            response_types: ["code"],
            scope: "openid profile email mcp",
            application_type: "web",
            subject_type: "public"
        },
        {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        }
    );

    return response;
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
