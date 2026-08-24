import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/api/auth";
import { COOKIE_NAME, SESSION_INDICATOR_COOKIE } from "@/lib/auth-cookie";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const { token, user } = await loginUser({ email, password });

        const response = NextResponse.json({ user }, { status: 200 });

        const cookieOpts = {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        };

        // httpOnly — carries the real JWT, not readable by JS
        response.cookies.set(COOKIE_NAME, token, { ...cookieOpts, httpOnly: true });

        // Non-httpOnly — readable by JS, used only as a fast "session exists" signal
        response.cookies.set(SESSION_INDICATOR_COOKIE, "1", { ...cookieOpts, httpOnly: false });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
