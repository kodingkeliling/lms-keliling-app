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

// GET /api/admin/subscriptions — list all subscriptions (with user info)
export async function GET(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const subscriptions = await prisma.subscription.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        planId: true,
                        planStartDate: true,
                        planEndDate: true,
                    },
                },
            },
        });

        return NextResponse.json({ subscriptions });
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/admin/subscriptions — add a new subscription for a user & update user's plan
export async function POST(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId, planId, startDate, endDate } = body;

        if (!userId || !planId || !PLAN_META[planId]) {
            return NextResponse.json({ error: "userId and valid planId are required" }, { status: 400 });
        }

        const meta = PLAN_META[planId];
        const now = new Date();
        const sDate = startDate ? new Date(startDate) : now;
        const eDate = endDate ? new Date(endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Create subscription record
        const subscription = await prisma.subscription.create({
            data: {
                userId,
                planId,
                planName: meta.name,
                price: meta.price,
                questions: meta.questions,
                createdAt: sDate,
            },
        });

        // Update user plan fields
        await prisma.user.update({
            where: { id: userId },
            data: {
                planId,
                planStartDate: sDate,
                planEndDate: eDate,
            },
        });

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error("Failed to create subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/admin/subscriptions — edit subscription record
export async function PATCH(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, planId, price } = body;

        if (!id) {
            return NextResponse.json({ error: "subscription id is required" }, { status: 400 });
        }

        const dataToUpdate: any = {};
        if (planId && PLAN_META[planId]) {
            dataToUpdate.planId = planId;
            dataToUpdate.planName = PLAN_META[planId].name;
            dataToUpdate.questions = PLAN_META[planId].questions;
            if (price === undefined) dataToUpdate.price = PLAN_META[planId].price;
        }
        if (price !== undefined) {
            dataToUpdate.price = Number(price);
        }

        const updated = await prisma.subscription.update({
            where: { id },
            data: dataToUpdate,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ subscription: updated });
    } catch (error) {
        console.error("Failed to update subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
