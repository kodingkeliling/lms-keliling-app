import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const origin = new URL(req.url).origin;

    return NextResponse.json(
        {
            resource: origin,
            authorization_servers: [
                `${origin}/.well-known/oauth-authorization-server`,
                origin
            ],
            resource_name: "LMS Keliling MCP"
        },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json"
            }
        }
    );
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
