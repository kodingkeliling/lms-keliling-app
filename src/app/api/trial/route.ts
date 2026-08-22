import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FREE_LIMIT = 100;

function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

// GET: check how many questions this IP has used
export async function GET(req: NextRequest) {
    const ip = getClientIp(req);

    try {
        const trial = await prisma.ipTrial.findUnique({ where: { ip } });
        const used = trial?.questionsUsed ?? 0;

        return NextResponse.json({
            ip,
            questionsUsed: used,
            remaining: Math.max(0, FREE_LIMIT - used),
            limitReached: used >= FREE_LIMIT,
        });
    } catch (error) {
        console.error("Trial GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: increment questions used for this IP
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
