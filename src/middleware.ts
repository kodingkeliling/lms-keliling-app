import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth-cookie";

const JWT_SECRET = process.env.JWT_SECRET ?? "fraise-secret-key-change-in-production";

const PROTECTED_PREFIXES = ["/dashboard", "/playground"];
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

    // Try to get and verify token for any relevant page
    const token = req.cookies.get(COOKIE_NAME)?.value;
    let role: string | undefined;

    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            role = (payload as any).role as string | undefined;
        } catch {
            // Token invalid — treat as logged out
        }
    }

    // Already logged in → redirect away from auth pages
    if (isAuthPage && role) {
        const redirectTo = req.nextUrl.searchParams.get("redirect");
        const dest = redirectTo ?? (role === "SUPER_ADMIN" ? "/dashboard" : "/playground");
        return NextResponse.redirect(new URL(dest, req.url));
    }

    // Protected route — not logged in
    if (isProtected && !role) {
        const redirectUrl = new URL("/login", req.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Role-based access control
    if (isProtected && role) {
        // SUPER_ADMIN → only /dashboard, not /playground
        if (role === "SUPER_ADMIN" && pathname.startsWith("/playground")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        // USER → cannot access /dashboard
        if (role === "USER" && pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/playground",
        "/playground/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
    ],
};

