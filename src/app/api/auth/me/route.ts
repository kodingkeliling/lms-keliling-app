import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            planId: true,
            questionLimit: true,
            avatarId: true,
        },
    });

    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: dbUser }, { status: 200 });
}

export async function DELETE() {
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return response;
}
