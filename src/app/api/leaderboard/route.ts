import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvatarUrl } from "@/data/avatars";

export async function GET() {
    try {
        // Query users excluding SUPER_ADMIN
        const users = await prisma.user.findMany({
            where: { role: "USER" },
            select: {
                id: true,
                name: true,
                email: true,
                planId: true,
                questionLimit: true,
                avatarId: true,
                exams: {
                    select: {
                        id: true,
                        status: true,
                        questions: {
                            select: {
                                score: true,
                                answer: true,
                            },
                        },
                    },
                },
                subscriptions: {
                    select: {
                        price: true,
                        planName: true,
                        planId: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Helper to determine current plan label
        const getPlanName = (planId: string | null) => {
            if (planId === "ultimate-1000") return "Luxury";
            if (planId === "pro-500") return "Eksklusif";
            if (planId === "starter-100") return "Premium";
            return "Free";
        };

        // Process actual DB users for Top Points
        const dbPointsUsers = users.map((u) => {
            const completedExams = u.exams.filter((e) => e.status === "completed");

            // Sum points from completed exam questions
            let points = 0;
            completedExams.forEach((e) => {
                e.questions.forEach((q) => {
                    if (q.score) points += Math.round(q.score * 10);
                    else if (q.answer) points += 20;
                    else points += 10;
                });
            });

            const displayName = u.name && u.name.trim() !== "" ? u.name : u.email.split("@")[0];
            const planLabel = getPlanName(u.planId);

            return {
                id: u.id,
                rank: 0,
                name: displayName,
                avatar: getAvatarUrl(u.avatarId),
                points,
                examsCompleted: completedExams.length,
                badgeLabel: planLabel,
            };
        });

        // Sort by points descending and assign ranks
        const sortedPoints = dbPointsUsers
            .sort((a, b) => b.points - a.points)
            .map((u, i) => ({ ...u, rank: i + 1 }));

        // Process actual DB users for Top Subscriptions (Total Spend from history)
        const dbSubscriptionUsers = users.map((u) => {
            const displayName = u.name && u.name.trim() !== "" ? u.name : u.email.split("@")[0];
            const planLabel = getPlanName(u.planId);
            const completedExams = u.exams.filter((e) => e.status === "completed");

            // Calculate total spend from actual subscription purchase history
            const totalSpend = u.subscriptions.reduce((acc, s) => acc + s.price, 0);
            const purchaseCount = u.subscriptions.length;

            return {
                id: u.id,
                rank: 0,
                name: displayName,
                avatar: getAvatarUrl(u.avatarId),
                totalSpend,
                purchaseCount,
                examsCompleted: completedExams.length,
                badgeLabel: planLabel,
            };
        });

        // Sort by total spend descending and assign ranks
        const sortedSubscriptions = dbSubscriptionUsers
            .sort((a, b) => b.totalSpend - a.totalSpend)
            .map((u, i) => ({ ...u, rank: i + 1 }));

        return NextResponse.json({
            topPoints: sortedPoints,
            topSubscriptions: sortedSubscriptions,
        });
    } catch (error) {
        console.error("Leaderboard GET error:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
