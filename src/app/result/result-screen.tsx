"use client";

import { useRouter, useParams } from "next/navigation";
import { CheckCircle, ChevronDown, RefreshCcw01, XCircle, Zap } from "@untitledui/icons";
import { Button } from "../../components/base/buttons/button";
import { FeaturedIcon } from "../../components/foundations/featured-icon/featured-icon";
import { useEffect, useState } from "react";
import { useExamStore, useActiveExam } from "../../store/use-exam-store";
import { useAuthStore } from "../../store/use-auth-store";
import { cx } from "../../utils/cx";
import { Markdown } from "../../components/shared-assets/markdown";
import { calculateSimilarity } from "../../utils/string-similarity";
import { PlaygroundNavbar } from "../../components/layout/navbar/playground";
import ConfirmationModal from "@/components/layout/confirmation-modal";
import { AuthGate } from "@/components/shared-assets/auth-gate";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ResultSkeleton = () => (
    <div className="flex min-h-dvh flex-col bg-primary">
        <PlaygroundNavbar />
        <div className="flex-1 px-4 py-8 md:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 animate-pulse">
                {/* Score summary */}
                <div className="flex flex-col items-center gap-6">
                    <div className="size-16 rounded-full bg-secondary" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-48 rounded-lg bg-secondary" />
                        <div className="h-5 w-64 rounded-lg bg-secondary" />
                    </div>
                    <div className="flex gap-3">
                        <div className="h-11 w-32 rounded-lg bg-secondary" />
                        <div className="h-11 w-36 rounded-lg bg-secondary" />
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-secondary p-5 flex flex-col items-center gap-2">
                            <div className="h-3 w-20 rounded bg-secondary" />
                            <div className="h-9 w-16 rounded-lg bg-secondary" />
                            <div className="h-3 w-24 rounded bg-secondary" />
                        </div>
                    ))}
                </div>

                <hr className="border-secondary" />

                {/* Review toggle */}
                <div className="h-16 w-full rounded-xl border border-secondary bg-secondary/20" />
            </div>
        </div>
    </div>
);

export const ResultScreen = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const activeExam = useActiveExam();
    const { selectExam, exams, retryActiveExam, hasHydrated } = useExamStore();
    const user = useAuthStore((state) => state.user);
    const { isAuthReady } = useAuthStore();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isRetakeConfirmOpen, setIsRetakeConfirmOpen] = useState(false);

    // Sync active exam with URL
    useEffect(() => {
        if (id && id !== activeExam?.id) {
            selectExam(id);
        }
    }, [id, activeExam?.id, selectExam]);

    // Sync local exam to database if user just logged in after taking an exam anonymously
    useEffect(() => {
        if (user && activeExam && !activeExam.isDemo) {
            fetch("/api/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: activeExam.id,
                    createdAt: activeExam.createdAt,
                    config: activeExam.config,
                    questions: activeExam.questions,
                    status: activeExam.status || "completed",
                    startTime: activeExam.startTime,
                    endTime: activeExam.endTime,
                })
            }).then(() => {
                if (Object.keys(activeExam.userAnswers || {}).length > 0) {
                    fetch(`/api/exams/${activeExam.id}/submit`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userAnswers: activeExam.userAnswers,
                            status: "completed",
                            startTime: activeExam.startTime,
                            endTime: activeExam.endTime,
                        })
                    }).catch((err) => console.error("Failed to submit exam:", err));
                }
            }).catch((err) => console.error("Failed to sync local exam to server:", err));
        }
    }, [user, activeExam?.id]);

    // Store not yet rehydrated from localStorage → show skeleton
    if (!hasHydrated || !isAuthReady) {
        return <ResultSkeleton />;
    }

    if (!activeExam || (activeExam.id !== id && exams.find(e => e.id === id))) {
        return <ResultSkeleton />;
    }

    if (!activeExam || activeExam.questions.length === 0) {
        router.push("/");
        return null;
    }

    // LOGIN GATE — if user not logged in, show gate instead of results
    if (!user) {
        return (
            <div className="flex min-h-dvh flex-col bg-primary">
                <PlaygroundNavbar />
                <AuthGate
                    redirectAfterLogin={`/result/${id}`}
                    title="Login untuk Melihat Hasil"
                    description="Hasil ujianmu sudah siap! Buat akun atau login terlebih dahulu untuk melihat skor dan ulasan jawaban kamu."
                />
            </div>
        );
    }

    const { questions, userAnswers } = activeExam;

    const gradableQuestions = questions.filter(q => !!q.options || q.skill.toLowerCase() === "writing" || q.skill.toLowerCase() === "speaking");

    const correctAnswersCount = gradableQuestions.filter(q => {
        const userAnswerRaw = userAnswers[q.id] || "";

        if (q.options) {
            return userAnswerRaw === q.answer;
        }

        if (q.skill.toLowerCase() === "writing" || q.skill.toLowerCase() === "speaking") {
            try {
                if (q.skill.toLowerCase() === "writing") {
                    // For writing, answers are stored as a JSON array of strings
                    const userAnsArr = JSON.parse(userAnswerRaw || "[]");
                    const correctAnsArr = q.answer.split("|->").map(a => a.trim());

                    if (correctAnsArr.length === 0) return false;

                    // Calculate average similarity across all blanks
                    let totalSimilarity = 0;
                    correctAnsArr.forEach((correct, idx) => {
                        totalSimilarity += calculateSimilarity(userAnsArr[idx] || "", correct);
                    });

                    const averageSimilarity = totalSimilarity / correctAnsArr.length;
                    return averageSimilarity >= 0.8;
                }

                return calculateSimilarity(userAnswerRaw, q.answer) >= 0.7;
            } catch {
                return calculateSimilarity(userAnswerRaw, q.answer) >= 0.7;
            }
        }

        return false;
    }).length;

    const scorePercentage = gradableQuestions.length > 0
        ? Math.round((correctAnswersCount / gradableQuestions.length) * 100)
        : 100;

    const formatDuration = (start: number | null, end: number | null) => {
        if (!start || !end) return "0s";
        const diffMs = end - start;
        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) return `${diffSecs}s`;
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        return `${mins}m ${secs}s`;
    };
    const durationStr = formatDuration(activeExam.startTime, activeExam.endTime);

    const handleRestart = () => {
        setIsRetakeConfirmOpen(true);
    };

    const handleConfirmRestart = () => {
        setIsRetakeConfirmOpen(false);
        retryActiveExam();
        router.push(`/playground/${activeExam.id}`);
    };

    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            <PlaygroundNavbar />
            <div className="flex-1 px-4 py-8 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">

                    {/* Score Summary */}
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="relative">
                            <FeaturedIcon icon={Zap} color="brand" theme="dark" size="xl" />
                            <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-white">
                                {scorePercentage}%
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-display-sm font-semibold text-primary">
                                {activeExam.title ? activeExam.title : "Ujian Selesai!"}
                            </h1>
                            <p className="text-lg text-tertiary">
                                Kamu menjawab {correctAnswersCount} dari {gradableQuestions.length} soal dengan benar.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button color="secondary" size="lg" iconLeading={RefreshCcw01} onClick={handleRestart}>
                                Ulangi Tes
                            </Button>
                            <Button size="lg" onClick={() => router.push("/playground")}>
                                Ke Playground
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Score Card */}
                        <div className="rounded-xl border border-secondary bg-secondary/20 p-5 text-center flex flex-col gap-1.5 shadow-xs">
                            <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">Skor Akhir</span>
                            <span className="text-3xl font-bold text-primary">{scorePercentage}%</span>
                            <span className="text-xs text-tertiary">Akurasi jawaban</span>
                        </div>

                        {/* Time Duration Card */}
                        <div className="rounded-xl border border-secondary bg-secondary/20 p-5 text-center flex flex-col gap-1.5 shadow-xs">
                            <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">Durasi</span>
                            <span className="text-3xl font-bold text-primary">{durationStr}</span>
                            <span className="text-xs text-tertiary">Waktu pengerjaan</span>
                        </div>

                        {/* Correct answers count */}
                        <div className="rounded-xl border border-secondary bg-secondary/20 p-5 text-center flex flex-col gap-1.5 shadow-xs">
                            <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">Rincian Jawaban</span>
                            <span className="text-3xl font-bold text-primary">{correctAnswersCount} / {gradableQuestions.length}</span>
                            <span className="text-xs text-tertiary">Jawaban benar</span>
                        </div>
                    </div>

                    <hr className="border-secondary" />

                    {/* Question Review (Collapsible) */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setIsReviewOpen(!isReviewOpen)}
                            className="flex w-full items-center justify-between rounded-xl border border-secondary bg-secondary/50 p-4 transition-all hover:bg-secondary"
                        >
                            <div className="flex flex-col items-start gap-1 text-left">
                                <h2 className="text-lg font-semibold text-primary">Ulasan Jawaban</h2>
                                <p className="text-sm text-tertiary">Periksa jawabanmu dan belajar dari kesalahan.</p>
                            </div>
                            <div className={cx("transition-transform duration-300", isReviewOpen ? "rotate-180" : "")}>
                                <ChevronDown className="size-5 text-tertiary" />
                            </div>
                        </button>

                        <div className={cx(
                            "grid transition-all duration-500 ease-in-out",
                            isReviewOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"
                        )}>
                            <div className="min-h-0">
                                <div className="flex flex-col gap-6 py-4">
                                    {questions.map((q, idx) => {
                                        const isMC = !!q.options;
                                        const isWriting = q.skill.toLowerCase() === "writing";
                                        const userAnswerRaw = userAnswers[q.id] || "";

                                        let isCorrect = false;
                                        let similarity = 0;
                                        let userAnsDisplay = userAnswerRaw;

                                        if (isMC) {
                                            isCorrect = userAnswerRaw === q.answer;
                                        } else if (isWriting || q.skill.toLowerCase() === "speaking") {
                                            if (isWriting) {
                                                try {
                                                    const userAnsArr = JSON.parse(userAnswerRaw || "[]");
                                                    const correctAnsArr = q.answer.split("|->").map(a => a.trim());

                                                    let totalSimilarity = 0;
                                                    correctAnsArr.forEach((correct, i) => {
                                                        totalSimilarity += calculateSimilarity(userAnsArr[i] || "", correct);
                                                    });
                                                    similarity = correctAnsArr.length > 0 ? totalSimilarity / correctAnsArr.length : 0;
                                                    isCorrect = similarity >= 0.9;

                                                    userAnsDisplay = Array.isArray(userAnsArr) ? userAnsArr.join(", ") : userAnswerRaw;
                                                } catch {
                                                    similarity = calculateSimilarity(userAnswerRaw, q.answer);
                                                    isCorrect = similarity >= 0.9;
                                                }
                                            } else {
                                                similarity = calculateSimilarity(userAnswerRaw, q.answer);
                                                isCorrect = similarity >= 0.9;
                                            }
                                        } else {
                                            isCorrect = true;
                                        }

                                        return (
                                            <div key={q.id} className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-6 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-tertiary"># {idx + 1}</span>
                                                        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-700">
                                                            {q.skill}
                                                        </span>
                                                    </div>
                                                    {(isMC || isWriting || q.skill.toLowerCase() === "speaking") && (
                                                        <div className={cx(
                                                            "flex items-center gap-1.5 text-sm font-medium",
                                                            isCorrect ? "text-success-primary" : "text-error-primary"
                                                        )}>
                                                            {isCorrect ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                                                            {isCorrect ? "Benar" : "Salah"}
                                                            {(isWriting || q.skill.toLowerCase() === "speaking") && <span className="text-xs text-tertiary ml-1">({Math.round(similarity * 100)}% match)</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                <Markdown content={q.description} className="text-md font-medium text-primary" />

                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-semibold text-secondary">Jawabanmu:</div>
                                                    <div className={cx(
                                                        "rounded-lg border p-3 text-sm",
                                                        (isMC || isWriting)
                                                            ? (isCorrect ? "border-success-200 bg-success-50 text-success-primary" : "border-error-200 bg-error-50 text-error-primary")
                                                            : "border-secondary bg-secondary text-primary"
                                                    )}>
                                                        {userAnsDisplay ? (
                                                            <Markdown content={userAnsDisplay} className="text-sm font-medium" />
                                                        ) : (
                                                            <span className="italic text-tertiary">Tidak dijawab</span>
                                                        )}
                                                    </div>

                                                    {!isCorrect && (isMC || isWriting || q.skill.toLowerCase() === "speaking") && (
                                                        <div className="mt-1">
                                                            <div className="text-sm font-semibold text-success-700">Jawaban Benar:</div>
                                                            <div className="text-sm text-success-700 font-medium">
                                                                <Markdown content={q.answer.replace(/\|->/g, ", ")} className="text-sm font-medium" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!isMC && !isWriting && (
                                                        <div className="mt-2 rounded-lg bg-brand-soft/10 border border-brand-200 p-4">
                                                            <div className="text-sm font-semibold text-brand-700">Kriteria Penilaian / Contoh Jawaban:</div>
                                                            <Markdown content={q.answer} className="mt-1 text-sm text-brand-700" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isRetakeConfirmOpen}
                onClose={() => setIsRetakeConfirmOpen(false)}
                onConfirm={handleConfirmRestart}
                title="Mengulang Ujian Ini?"
                description="Mengulang ujian akan mereset dan menggantikan data hasil/skor pengerjaan sebelumnya dengan hasil pengerjaan baru. Apakah Anda yakin ingin mengulang?"
                confirmLabel="Ya, Ulangi Ujian"
                cancelLabel="Batal"
                confirmColor="primary"
                iconColor="warning"
            />
        </div>
    );
};
