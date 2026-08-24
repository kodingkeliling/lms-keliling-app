import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_INDICATOR_COOKIE } from "@/lib/auth-cookie";

export async function POST() {
    const response = NextResponse.json({ success: true }, { status: 200 });

    const clearOpts = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 0,
        path: "/",
    };

    response.cookies.set(COOKIE_NAME, "", { ...clearOpts, httpOnly: true });
    response.cookies.set(SESSION_INDICATOR_COOKIE, "", { ...clearOpts, httpOnly: false });

    return response;
}
