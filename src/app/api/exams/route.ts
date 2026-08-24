import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";
import { SkillType } from "@/store/use-exam-store";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        const decodedUser = token ? verifyToken(token) : null;

        if (!decodedUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({ where: { email: decodedUser.email } });
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch all exams for the user (original exams or cloned attempts)
        const exams = await prisma.exam.findMany({
            where: { userId: dbUser.id },
            include: { questions: true, user: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" }
        });

        const mapped = exams.map((exam) => ({
            id: exam.id,
            title: exam.title || undefined,
            createdAt: exam.createdAt.getTime(),
            config: {
                language: exam.language,
                questionCount: exam.questions.length,
                skills: exam.skills as SkillType[],
                duration: exam.duration ?? null,
            },
            questions: exam.questions.map((q) => {
                let description = q.content;
                let options: string[] | null = null;
                let answer = q.answer || "";
                const skill = (q.type.charAt(0).toUpperCase() + q.type.slice(1)) as SkillType;

                if (q.content.trim().startsWith("{")) {
                    try {
                        const parsed = JSON.parse(q.content);
                        description = parsed.description || q.content;
                        options = parsed.options || null;
                        answer = parsed.answer || "";
                    } catch {}
                }

                return { id: q.id, description, options, answer, skill };
            }),
            userAnswers: exam.questions.reduce((acc: Record<string, string>, q) => {
                if (q.answer) acc[q.id] = q.answer;
                return acc;
            }, {}),
            status: exam.status as any,
            currentQuestionIndex: 0,
            startTime: exam.startTime ? exam.startTime.getTime() : null,
            endTime: exam.endTime ? exam.endTime.getTime() : null,
            isPublic: exam.isPublic ?? false,
            ownedBy: exam.user?.name || exam.user?.email || exam.userId
        }));

        return NextResponse.json({ exams: mapped });
    } catch (error: any) {
        console.error("Failed to fetch user exams:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        const decodedUser = token ? verifyToken(token) : null;

        if (!decodedUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({ where: { email: decodedUser.email } });
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { id, createdAt, config, questions, status, isPublic, startTime, endTime } = body;

        if (!id || !config || !questions) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingExam = await prisma.exam.findUnique({ where: { id } });

        if (existingExam) {
            await prisma.exam.update({
                where: { id },
                data: {
                    status: status || existingExam.status,
                    isPublic: typeof isPublic === "boolean" ? isPublic : existingExam.isPublic,
                    startTime: startTime ? new Date(startTime) : existingExam.startTime,
                    endTime: endTime ? new Date(endTime) : existingExam.endTime,
                    duration: config.duration ?? existingExam.duration,
                }
            });
            return NextResponse.json({ success: true, message: "Exam updated" });
        }

        const createdExam = await prisma.exam.create({
            data: {
                id,
                userId: dbUser.id,
                language: config.language,
                skills: config.skills,
                provider: "auto",
                status: status || "ongoing",
                isPublic: typeof isPublic === "boolean" ? isPublic : false,
                createdAt: createdAt ? new Date(createdAt) : new Date(),
                duration: config.duration ?? null,
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
            }
        });

        await prisma.question.createMany({
            data: questions.map((q: any) => {
                const type = q.skill.toLowerCase();
                const content = JSON.stringify({
                    description: q.description,
                    options: q.options,
                    answer: q.answer
                });

                return {
                    id: q.id,
                    examId: createdExam.id,
                    content,
                    type
                };
            })
        });

        return NextResponse.json({ success: true, examId: createdExam.id });
    } catch (error: any) {
        console.error("Failed to sync local exam:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
