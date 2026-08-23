import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";

const FREE_LIMIT = 100;

function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

async function getQuestionsUsedForUserOrIp(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const decoded = token ? verifyToken(token) : null;

    if (decoded?.email) {
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            select: { id: true, role: true },
        });

        if (user) {
            // Count actual active questions created by logged-in user
            const questionCount = await prisma.question.count({
                where: {
                    exam: {
                        userId: user.id,
                    },
                },
            });
            return { used: questionCount, userId: user.id };
        }
    }

    // Fallback to IP trial for unauthenticated users
    const ip = getClientIp(req);
    const trial = await prisma.ipTrial.findUnique({ where: { ip } });
    return { used: trial?.questionsUsed ?? 0, ip };
}

// GET: check how many questions have been used
export async function GET(req: NextRequest) {
    try {
        const { used } = await getQuestionsUsedForUserOrIp(req);

        return NextResponse.json({
            questionsUsed: used,
            remaining: Math.max(0, FREE_LIMIT - used),
            limitReached: used >= FREE_LIMIT,
        });
    } catch (error) {
        console.error("Trial GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: increment questions used for IP (guests only)
export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const count: number = body.count ?? 1;

    try {
        const trial = await prisma.ipTrial.upsert({
            where: { ip },
            update: {
                questionsUsed: { increment: count },
                lastUsedAt: new Date(),
            },
            create: {
                ip,
                questionsUsed: count,
            },
        });

        const used = trial.questionsUsed;

        return NextResponse.json({
            ip,
            questionsUsed: used,
            remaining: Math.max(0, FREE_LIMIT - used),
            limitReached: used >= FREE_LIMIT,
        });
    } catch (error) {
        console.error("Trial POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
