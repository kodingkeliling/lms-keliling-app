import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME } from "@/lib/auth-cookie";
import { ANIMAL_AVATARS } from "@/data/avatars";

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await req.json();
    const { avatarId } = body;

    const found = ANIMAL_AVATARS.find((a) => a.id === avatarId || a.url === avatarId);
    if (!avatarId || !found) {
        return NextResponse.json({ error: "Avatar tidak valid" }, { status: 400 });
    }

    // Save image file path into database e.g. "/avatar/cat.png"
    const savedPath = found.url;

    await prisma.user.update({
        where: { id: user.id },
        data: { avatarId: savedPath },
    });

    return NextResponse.json({ success: true, avatarId: savedPath });
}
