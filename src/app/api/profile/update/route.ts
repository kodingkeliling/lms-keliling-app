import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME } from "@/lib/auth-cookie";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, password } = body;

    const updateData: { name?: string; passwordHash?: string } = {};

    if (typeof name === "string") {
        updateData.name = name.trim();
    }

    if (password && typeof password === "string" && password.trim() !== "") {
        if (password.length < 6) {
            return NextResponse.json({ error: "Kata sandi minimal 6 karakter" }, { status: 400 });
        }
        updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: updateData,
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

    return NextResponse.json({ success: true, user: updatedUser });
}
