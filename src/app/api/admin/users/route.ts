import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";

function getAdminUser(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const user = verifyToken(token);
    if (!user || user.role !== "SUPER_ADMIN") return null;
    return user;
}

const PLAN_META: Record<string, { name: string; price: number; questions: number }> = {
    "starter-100": { name: "Premium", price: 5000, questions: 100 },
    "pro-500": { name: "Eksklusif", price: 7500, questions: 500 },
    "ultimate-1000": { name: "Luxury", price: 20000, questions: 1000 },
};

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            planId: true,
            planStartDate: true,
            planEndDate: true,
            isVerified: true,
            createdAt: true,
        },
    });

    return NextResponse.json({ users });
}

// PATCH /api/admin/users — update plan for a user + record subscription history
export async function PATCH(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, planId, planStartDate, planEndDate } = body;

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Get previous plan to detect if planId actually changed
    const prevUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { planId: true },
    });

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            planId: planId ?? null,
            planStartDate: planStartDate ? new Date(planStartDate) : null,
            planEndDate: planEndDate ? new Date(planEndDate) : null,
        },
        select: {
            id: true,
            email: true,
            planId: true,
            planStartDate: true,
            planEndDate: true,
        },
    });

    // Record subscription purchase if planId is new and valid
    if (planId && PLAN_META[planId] && prevUser?.planId !== planId) {
        const meta = PLAN_META[planId];
        await prisma.subscription.create({
            data: {
                userId,
                planId,
                planName: meta.name,
                price: meta.price,
                questions: meta.questions,
            },
        });
    }

    return NextResponse.json({ user: updated });
}
