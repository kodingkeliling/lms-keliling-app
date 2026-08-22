"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, LayoutGrid02, Zap, LogOut01, InfoCircle } from "@untitledui/icons";
import { Button } from "../../components/base/buttons/button";
import { FeaturedIcon } from "../../components/foundations/featured-icon/featured-icon";
import { ProgressBar } from "../../components/base/progress-indicators/progress-indicators";
import { QuestionOptions } from "../../components/exam/question-options";
import { AudioPlayer } from "../../components/exam/audio-player";
import { SpeakingInput } from "../../components/exam/speaking-input";
import { ThemeToggle } from "../../components/foundations/theme-toggle";
import { useExamStore, useActiveExam, Question } from "../../store/use-exam-store";
import { useConfigStore } from "../../store/use-config-store";
import { cx } from "../../utils/cx";
import { Markdown } from "../../components/shared-assets/markdown";
import { useToast } from "@/contexts/use-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { Badge } from "@/components/base/badges/badges";
import Image from "next/image";
import { AdsModal } from "@/components/shared-assets/ads-modal";
import { ADS, PAID_PLAN_IDS } from "@/data/ads";
import ConfirmationModal from "@/components/layout/confirmation-modal";
import { Modal } from "@/components/shared-assets/modal";

const PAGE_SIZE = 50;

export const PlaygroundScreen = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const activeExam = useActiveExam();
    const { toastError, toastWarning } = useToast();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
    const { isAuthenticated, user } = useAuthStore();
    const showAds = !user?.planId || !PAID_PLAN_IDS.includes(user.planId);
    const [adsModalAd, setAdsModalAd] = useState<(typeof ADS)[number] | null>(null);
    const pendingStartRef = useRef(false);
    const [currentPage, setCurrentPage] = useState(0);

    const {
        selectExam,
        setQuestions,
        setStatus,
        setAnswer,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        finishExam,
        deleteExam,
        exams,
        hasHydrated,
        startExam,
        addOrUpdateExam,
    } = useExamStore();

    const [generatingProgress, setGeneratingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const isGenerating = useRef(false);
    const [loadingExam, setLoadingExam] = useState(false);
    const isFetchingRef = useRef(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const {
        provider,
        modelName,
        customApiKeys,
        usePersonalKey
    } = useConfigStore();

    // Keep sidebar page in sync with current question index
    useEffect(() => {
        if (activeExam?.currentQuestionIndex !== undefined) {
            const pageIndex = Math.floor(activeExam.currentQuestionIndex / PAGE_SIZE);
            setCurrentPage(pageIndex);
        }
    }, [activeExam?.currentQuestionIndex]);

    const generateAllQuestions = useCallback(async () => {
        if (isGenerating.current || !activeExam) return;
        isGenerating.current = true;

        setStatus("generating");
        setError(null);
        setGeneratingProgress(0);

        const chunkSize = 1;
        const total = activeExam.config.questionCount;
        const chunks = Math.ceil(total / chunkSize);

        let allQuestions: Question[] = [];

        try {
            for (let i = 0; i < chunks; i++) {
                const range = `question number ${i + 1}`;
                const config = activeExam.config;
                const skill = config.skills[Math.floor(Math.random() * config.skills.length)];

                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        range,
                        skill,
                        language: config.language,
                        provider,
                        model: modelName,
                        customApiKey: usePersonalKey ? customApiKeys[provider] : undefined
                    }),
                });

                const chunkData = await response.json();

                if (!response.ok) {
                    const errorMessage = chunkData.error || "Reached usage limit or API error.";

                    if (allQuestions.length > 0) {
                        toastWarning(
                            `Generation partially stopped: ${errorMessage}. Using ${allQuestions.length} questions.`,
                            "Partial Content Generated"
                        );
                        break;
                    } else {
                        throw new Error(errorMessage);
                    }
                }

                const { questions: chunkQuestions } = chunkData;
                allQuestions = [...allQuestions, ...chunkQuestions];
                setGeneratingProgress(Math.round(((i + 1) / chunks) * 100));
            }

            if (allQuestions.length === 0) {
                throw new Error("AI failed to generate any questions. Please try again.");
            }

            setQuestions(allQuestions);
            setStatus("ongoing");

            if (isAuthenticated && activeExam && !activeExam.isDemo) {
                fetch("/api/exams", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: activeExam.id,
                        createdAt: activeExam.createdAt,
                        config: activeExam.config,
                        questions: allQuestions,
                        status: "ongoing"
                    })
                }).catch((err) => console.error("Failed to sync exam to server:", err));
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.message || "Failed to generate questions. Please try again.";
            setError(errorMessage);

            toastError(errorMessage, "Generation Failed");

            if (activeExam) {
                deleteExam(activeExam.id);
            }
            router.push("/");
        } finally {
            isGenerating.current = false;
        }
    }, [activeExam, setStatus, setQuestions, toastError, toastWarning, router, deleteExam, provider, modelName, customApiKeys, usePersonalKey]);

    useEffect(() => {
        if (!hasHydrated || !id) return;

        const exists = exams.some((e) => e.id === id);
        if (!exists && !id.startsWith("demo-") && !isFetchingRef.current) {
            isFetchingRef.current = true;
            setLoadingExam(true);
            setFetchError(null);
            fetch(`/api/exams/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Exam not found on server");
                    return res.json();
                })
                .then((data) => {
                    addOrUpdateExam(data.exam);
                })
                .catch((err) => {
                    setFetchError(err.message || "Failed to load exam");
                })
                .finally(() => {
                    setLoadingExam(false);
                    isFetchingRef.current = false;
                });
        }
    }, [id, hasHydrated, addOrUpdateExam, exams]);

    useEffect(() => {
        if (hasHydrated && id && id !== activeExam?.id && exams.some((e) => e.id === id)) {
            selectExam(id);
        }
    }, [id, activeExam?.id, selectExam, hasHydrated, exams]);

    useEffect(() => {
        if (
            hasHydrated &&
            id &&
            !loadingExam &&
            !isFetchingRef.current &&
            !exams.find((e) => e.id === id) &&
            fetchError
        ) {
            router.push("/playground");
        }
    }, [id, exams, router, hasHydrated, loadingExam, fetchError]);

    useEffect(() => {
        if (activeExam?.status === "idle" && (activeExam?.config?.questionCount || 0) > 0) {
            generateAllQuestions();
        } else if (activeExam?.isDemo && activeExam?.startTime === null) {
            startExam();
        }
    }, [activeExam?.status, activeExam?.isDemo, activeExam?.startTime, generateAllQuestions, startExam]);

    // Keyboard Shortcuts Handler
    useEffect(() => {
        if (!activeExam || activeExam.status !== "ongoing") return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isTyping =
                activeElement &&
                (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    (activeElement as HTMLElement).isContentEditable);

            const questions = activeExam.questions;
            const currentIdx = activeExam.currentQuestionIndex;
            const currentQuestion = questions[currentIdx];
            if (!currentQuestion) return;

            const currentSkill = currentQuestion.skill.toLowerCase();

            // 1. Command + Enter or Ctrl + Enter: Trigger speaking mic or listening audio
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                if (currentSkill === "speaking") {
                    const micBtn = document.querySelector('[data-speaking-mic-btn="true"]') as HTMLButtonElement | null;
                    if (micBtn) micBtn.click();
                } else if (currentSkill === "listening") {
                    const audioBtn = document.querySelector('[data-audio-player-btn="true"]') as HTMLButtonElement | null;
                    if (audioBtn) audioBtn.click();
                }
                return;
            }

            // If user is actively typing in a text field (e.g. writing task/textarea), don't hijack normal typing keys except Cmd+Enter
            if (isTyping) {
                if (e.key === "Enter" && !e.shiftKey) {
                    const currentAnswer = activeExam.userAnswers[currentQuestion.id];
                    if (!currentAnswer || currentAnswer.trim() === "") {
                        e.preventDefault();
                        toastWarning("Silakan isi jawaban terlebih dahulu sebelum melanjutkan.", "Jawaban Wajib Diisi");
                        return;
                    }
                    e.preventDefault();
                    if (currentIdx < questions.length - 1) {
                        nextQuestion();
                    } else {
                        setIsConfirmModalOpen(true);
                    }
                }
                return;
            }

            // 2. Arrow Left & Arrow Right: Navigate between question pages
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                if (currentIdx > 0) prevQuestion();
                return;
            }

            if (e.key === "ArrowRight") {
                e.preventDefault();
                if (currentIdx < questions.length - 1) nextQuestion();
                return;
            }

            // 3. Numbers 1, 2, 3, 4: Select multiple choice options for multiple choice questions
            if (["1", "2", "3", "4"].includes(e.key) && currentQuestion.options) {
                const optionIndex = parseInt(e.key, 10) - 1;
                if (currentQuestion.options[optionIndex]) {
                    e.preventDefault();
                    setAnswer(currentQuestion.id, currentQuestion.options[optionIndex]);
                }
                return;
            }

            // 4. Enter key: Validate required response or go to next question
            if (e.key === "Enter") {
                e.preventDefault();
                const currentAnswer = activeExam.userAnswers[currentQuestion.id];
                if (!currentAnswer || currentAnswer.trim() === "") {
                    toastWarning("Silakan jawab pertanyaan ini terlebih dahulu.", "Jawaban Wajib Diisi");
                    return;
                }
                if (currentIdx < questions.length - 1) {
                    nextQuestion();
                } else {
                    setIsConfirmModalOpen(true);
                }
                return;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeExam, nextQuestion, prevQuestion, setAnswer, toastWarning]);

    if (loadingExam || !hasHydrated) {
        return (
            <div className="flex min-h-dvh flex-col bg-primary animate-pulse">
                <header className="sticky top-0 z-30 border-b border-secondary bg-primary px-4 py-3 md:px-8">
                    <div className="mx-auto flex w-full max-w-container items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="size-7 rounded-lg bg-secondary" />
                            <hr className="h-4 w-px bg-border-secondary md:h-6" />
                            <div className="h-4 w-12 rounded bg-secondary" />
                        </div>
                        <div className="hidden items-center gap-2 md:flex">
                            <div className="h-2 w-40 rounded-full bg-secondary" />
                            <div className="h-3 w-8 rounded bg-secondary" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-secondary" />
                            <div className="hidden size-8 rounded-full bg-secondary md:block" />
                        </div>
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-container flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8 md:py-8">
                    <aside className="hidden h-fit w-64 shrink-0 flex-col gap-4 rounded-xl border border-secondary p-4 md:flex">
                        <div className="h-4 w-24 rounded bg-secondary mb-2" />
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 10 }).map((_, idx) => (
                                <div key={idx} className="aspect-square rounded-lg bg-secondary" />
                            ))}
                        </div>
                    </aside>

                    <section className="flex flex-1 flex-col gap-8">
                        <div className="flex flex-col gap-6 rounded-2xl border border-secondary bg-primary p-5 shadow-xs md:p-10">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-20 rounded-full bg-secondary" />
                            </div>

                            <div className="flex flex-col gap-4 mt-2">
                                <div className="h-5 w-3/4 rounded bg-secondary" />
                                <div className="h-5 w-1/2 rounded bg-secondary" />
                                <div className="h-5 w-2/3 rounded bg-secondary" />
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="h-12 w-full rounded-xl bg-secondary" />
                                <div className="h-12 w-full rounded-xl bg-secondary" />
                                <div className="h-12 w-full rounded-xl bg-secondary" />
                                <div className="h-12 w-full rounded-xl bg-secondary" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-auto">
                            <div className="h-10 w-28 rounded-lg bg-secondary" />
                            <div className="h-10 w-28 rounded-lg bg-secondary" />
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    if (!activeExam) return null;

    const { config, questions, status, currentQuestionIndex, userAnswers } = activeExam;

    if (status === "generating") {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-8 bg-primary px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <FeaturedIcon icon={Zap} color="brand" theme="light" size="lg" className="animate-pulse" />
                    <h2 className="text-display-sm font-semibold text-primary">AI is crafting your exam...</h2>
                    <p className="text-md text-tertiary">Generating {config.questionCount} questions based on your preferences.</p>
                </div>
                <div className="w-full max-w-md">
                    <ProgressBar value={generatingProgress} labelPosition="bottom" />
                </div>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-primary px-4">
                <div className="text-center">
                    <h2 className="text-display-sm font-semibold text-error-600">Oops! Something went wrong</h2>
                    <p className="mt-2 text-md text-tertiary">{error}</p>
                </div>
                <Button onClick={generateAllQuestions}>Retry Generation</Button>
                <Button color="secondary" onClick={() => { deleteExam(activeExam.id); router.push("/"); }}>Cancel & Back Home</Button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-primary px-4">
                <div className="text-center">
                    <FeaturedIcon icon={Zap} color="brand" theme="light" size="lg" />
                    <h2 className="text-display-sm font-semibold text-primary">No questions found</h2>
                    <p className="mt-2 text-md text-tertiary">We couldn't find any questions for this exam.</p>
                </div>
                <Button onClick={generateAllQuestions}>Generate Questions</Button>
                <Button color="secondary" onClick={() => router.push("/")}>Back to Home</Button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion && questions.length > 0) {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-primary px-4 text-center">
                <p className="text-md text-tertiary">Loading question {currentQuestionIndex + 1}...</p>
                <Button color="secondary" onClick={() => goToQuestion(0)}>Reset to Question 1</Button>
            </div>
        );
    }

    if (questions.length === 0) return null;

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleExit = () => {
        if (isAuthenticated) {
            router.push("/playground");
        } else {
            router.push("/");
        }
    };

    const SKILL_BADGE_COLORS: Record<string, "blue" | "purple" | "orange" | "success"> = {
        Reading: "blue",
        Writing: "purple",
        Speaking: "orange",
        Listening: "success",
    };

    const totalPages = Math.ceil(questions.length / PAGE_SIZE);
    const startIdx = currentPage * PAGE_SIZE;
    const endIdx = Math.min(questions.length, startIdx + PAGE_SIZE);
    const paginatedQuestions = questions.slice(startIdx, endIdx);
    const answeredCount = Object.values(userAnswers).filter((v) => v && v.trim() !== "").length;
    const answeredPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    if (activeExam.startTime === null) {
        return (
            <div className="flex min-h-dvh flex-col bg-primary animate-in fade-in duration-300">
                <header className="sticky top-0 z-30 border-b border-secondary bg-primary px-4 py-3 md:px-8">
                    <div className="mx-auto flex w-full max-w-container items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-4">
                            <Button
                                color="tertiary"
                                size="sm"
                                onClick={handleExit}
                                className="!p-1.5"
                            >
                                <Image src="/logo.png" className="object-contain" alt="LMS Keliling Logo" width={28} height={28} />
                            </Button>
                            <hr className="h-4 w-px bg-border-secondary md:h-6" />
                            <span className="text-xs font-semibold text-primary md:text-sm">
                                Persiapan Ujian
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <ThemeToggle />
                            {isAuthenticated && (
                                <div className="hidden md:block">
                                    <UserDropdown />
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-12">
                    <div className="flex flex-col items-center gap-6 rounded-2xl border border-secondary bg-primary_alt p-8 text-center shadow-md">
                        <FeaturedIcon icon={Zap} color="brand" theme="light" size="xl" />
                        <div className="flex flex-col gap-2">
                            <h2 className="text-display-xs font-semibold text-primary">Siap untuk Memulai Ujian?</h2>
                            <p className="text-sm text-tertiary">
                                Silakan periksa kembali konfigurasi ujian Anda sebelum memulai. Timer akan mulai berjalan setelah Anda menekan tombol di bawah.
                            </p>
                        </div>

                        <div className="w-full border-t border-b border-secondary py-4 text-left flex flex-col gap-3">
                            <div className="flex justify-between py-1 text-sm">
                                <span className="text-tertiary">Bahasa</span>
                                <span className="font-semibold text-primary">{config.language}</span>
                            </div>
                            <div className="flex justify-between py-1.5 text-sm border-t border-secondary">
                                <span className="text-tertiary">Jumlah Soal</span>
                                <span className="font-semibold text-primary">{questions.length} Soal</span>
                            </div>
                            <div className="flex justify-between py-1.5 text-sm border-t border-secondary">
                                <span className="text-tertiary">Skill yang Diuji</span>
                                <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                                    {config.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            type="pill-color"
                                            size="sm"
                                            color={SKILL_BADGE_COLORS[skill] ?? "gray"}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full gap-3">
                            <Button className="flex-1" color="secondary" onClick={handleExit}>
                                Batal
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    if (showAds) {
                                        const randomAd = ADS[Math.floor(Math.random() * ADS.length)];
                                        pendingStartRef.current = true;
                                        setAdsModalAd(randomAd);
                                    } else {
                                        startExam();
                                    }
                                }}
                            >
                                Mulai Ujian
                            </Button>
                        </div>
                    </div>
                </main>

                {adsModalAd && (
                    <AdsModal
                        ad={adsModalAd}
                        onClose={() => {
                            setAdsModalAd(null);
                            if (pendingStartRef.current) {
                                pendingStartRef.current = false;
                                startExam();
                            }
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            <header className="sticky top-0 z-30 border-b border-secondary bg-primary px-4 py-3 md:px-8">
                <div className="mx-auto flex w-full max-w-container items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            color="tertiary"
                            size="sm"
                            onClick={() => setIsExitModalOpen(true)}
                            className="!p-1.5"
                        >
                            <Image src="/logo.png" className="object-contain animate-in fade-in zoom-in duration-200" alt="LMS Keliling Logo" width={28} height={28} />
                        </Button>
                        <hr className="h-4 w-px bg-border-secondary md:h-6" />
                        <span className="text-xs font-semibold text-primary md:text-sm">
                            {currentQuestionIndex + 1}/{questions.length}
                        </span>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <ProgressBar value={answeredPercent} className="w-40" />
                        <span className="text-xs font-medium text-tertiary">{answeredPercent}%</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />
                        {isAuthenticated && (
                            <div className="hidden md:block">
                                <UserDropdown />
                            </div>
                        )}
                        <Button className="md:hidden" color="secondary" size="sm" iconLeading={LayoutGrid02} onClick={() => setIsMobileMenuOpen(true)} />
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex items-end justify-center bg-overlay/40 backdrop-blur-sm md:hidden">
                    <div className="w-full bg-primary rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-secondary" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-primary">Jump to Question</h3>
                            <Button size="sm" color="tertiary" onClick={() => setIsMobileMenuOpen(false)}>Close</Button>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-2 mb-4 border-b border-secondary pb-3">
                                <Button
                                    size="sm"
                                    color="secondary"
                                    iconLeading={ChevronLeft}
                                    isDisabled={currentPage === 0}
                                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                />
                                <span className="text-xs font-medium text-green-600">
                                    {answeredCount}/{questions.length} dijawab
                                </span>
                                <Button
                                    size="sm"
                                    color="secondary"
                                    iconLeading={ChevronRight}
                                    isDisabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto pb-8">
                            {paginatedQuestions.map((_, pIdx) => {
                                const idx = startIdx + pIdx;
                                return (
                                    <Button
                                        key={idx}
                                        size="sm"
                                        color={
                                            currentQuestionIndex === idx
                                                ? "primary"
                                                : userAnswers[questions[idx].id]
                                                    ? "secondary"
                                                    : "tertiary"
                                        }
                                        onClick={() => {
                                            goToQuestion(idx);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={cx(
                                            "!p-0 flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition-all",
                                            userAnswers[questions[idx].id] && currentQuestionIndex !== idx && "bg-brand-soft text-brand-700 border border-brand-300"
                                        )}
                                    >
                                        {idx + 1}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <main className="mx-auto flex w-full max-w-container flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8 md:py-8">
                {/* Sticky Sidebar Navigation Card */}
                <aside className="hidden h-fit w-64 shrink-0 flex-col gap-4 rounded-xl border border-secondary bg-primary p-4 md:flex sticky top-20 shadow-xs">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">QUESTIONS</h3>
                        <span className="text-xs font-medium text-green-600">
                            {answeredCount}/{questions.length} dijawab
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                        {paginatedQuestions.map((_, pIdx) => {
                            const idx = startIdx + pIdx;
                            return (
                                <Button
                                    key={idx}
                                    size="sm"
                                    color={
                                        currentQuestionIndex === idx
                                            ? "primary"
                                            : userAnswers[questions[idx].id]
                                                ? "secondary"
                                                : "tertiary"
                                    }
                                    onClick={() => goToQuestion(idx)}
                                    className={cx(
                                        "!p-0 flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                        userAnswers[questions[idx].id] && currentQuestionIndex !== idx && "bg-brand-soft text-brand-700 border border-brand-300"
                                    )}
                                >
                                    {idx + 1}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Pagination Controls per 50 Items */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-secondary pt-3 mt-1">
                            <Button
                                size="sm"
                                color="secondary"
                                iconLeading={ChevronLeft}
                                isDisabled={currentPage === 0}
                                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                title="Halaman Sebelumnya"
                            />
                            <span className="text-xs font-medium text-tertiary">
                                Hal {currentPage + 1}/{totalPages}
                            </span>
                            <Button
                                size="sm"
                                color="secondary"
                                iconLeading={ChevronRight}
                                isDisabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                title="Halaman Selanjutnya"
                            />
                        </div>
                    )}
                </aside>

                <section className="flex flex-1 flex-col gap-8">
                    <div className="flex flex-col gap-4 md:gap-6 rounded-2xl border border-secondary bg-primary p-5 shadow-xs md:p-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge
                                    type="pill-color"
                                    size="sm"
                                    color="brand"
                                >
                                    {currentQuestion.skill}
                                </Badge>
                            </div>
                            <Button
                                color="tertiary"
                                size="sm"
                                iconLeading={InfoCircle}
                                onClick={() => setIsShortcutModalOpen(true)}
                                title="Keyboard Shortcuts Info"
                                className="text-xs hidden md:block"
                            />
                        </div>

                        <div className="flex flex-col gap-4 md:gap-6">
                            {currentQuestion.skill.toLowerCase() === "listening" ? (
                                <AudioPlayer key={currentQuestion.id} text={currentQuestion.description} language={config.language} />
                            ) : currentQuestion.skill.toLowerCase() === "writing" ? (
                                <div className="flex flex-col gap-6">
                                    <div className="text-md md:text-lg font-medium text-primary leading-relaxed">
                                        {(() => {
                                            const parts = currentQuestion.description.split(/\[blank\]|_{3,}/g);
                                            if (parts.length === 1) return <Markdown content={currentQuestion.description} />;

                                            const currentAnswers = (() => {
                                                try {
                                                    const parsed = JSON.parse(userAnswers[currentQuestion.id] || "[]");
                                                    return Array.isArray(parsed) ? parsed : [userAnswers[currentQuestion.id] || ""];
                                                } catch {
                                                    return [userAnswers[currentQuestion.id] || ""];
                                                }
                                            })();

                                            return parts.map((part, index) => (
                                                <span key={index}>
                                                    <Markdown content={part} className="inline prose-p:inline" />
                                                    {index < parts.length - 1 && (
                                                        <input
                                                            type="text"
                                                            value={currentAnswers[index] || ""}
                                                            onChange={(e) => {
                                                                const newAnswers = [...currentAnswers];
                                                                while (newAnswers.length <= index) newAnswers.push("");
                                                                newAnswers[index] = e.target.value;
                                                                setAnswer(currentQuestion.id, JSON.stringify(newAnswers));
                                                            }}
                                                            className="mx-1 inline-block h-8 min-w-[120px] rounded-md border border-secondary bg-secondary/50 px-2 text-sm text-primary outline-hidden ring-brand focus:ring-2"
                                                            placeholder="..."
                                                        />
                                                    )}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                    <p className="text-xs text-tertiary italic">Type directly into the blank spaces above.</p>
                                </div>
                            ) : (
                                <Markdown content={currentQuestion.description} className="text-md md:text-lg font-medium text-primary" />
                            )}
                        </div>

                        <div className="mt-2 md:mt-4">
                            {currentQuestion.skill.toLowerCase() === "speaking" ? (
                                <SpeakingInput
                                    value={userAnswers[currentQuestion.id] || ""}
                                    onChange={(val) => setAnswer(currentQuestion.id, val)}
                                    language={config.language}
                                    isRecording={isRecording}
                                    setIsRecording={setIsRecording}
                                />
                            ) : currentQuestion.skill.toLowerCase() === "writing" ? null : currentQuestion.options ? (
                                <QuestionOptions
                                    options={currentQuestion.options || []}
                                    value={userAnswers[currentQuestion.id] || ""}
                                    onChange={(val: string) => setAnswer(currentQuestion.id, val)}
                                />
                            ) : (
                                <textarea
                                    className="w-full min-h-[150px] md:min-h-[200px] rounded-xl border border-secondary bg-primary p-4 text-sm md:text-md text-primary outline-hidden ring-brand focus:ring-2"
                                    placeholder="Type your answer here..."
                                    value={userAnswers[currentQuestion.id] || ""}
                                    onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto gap-4">
                        <Button
                            color="secondary"
                            size="lg"
                            iconLeading={ArrowLeft}
                            isDisabled={currentQuestionIndex === 0}
                            onClick={prevQuestion}
                            className="flex-1 md:flex-initial"
                        >
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        {isLastQuestion ? (
                            <Button
                                size="lg"
                                color="primary"
                                iconTrailing={CheckCircle}
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="flex-1 md:flex-initial"
                            >
                                Finish Exam
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                color="primary"
                                iconTrailing={ArrowRight}
                                onClick={nextQuestion}
                                className="flex-1 md:flex-initial"
                            >
                                <span className="hidden sm:inline">Next Question</span>
                                <span className="sm:hidden">Next</span>
                            </Button>
                        )}
                    </div>
                </section>
            </main>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    setIsConfirmModalOpen(false);
                    finishExam();
                    if (isAuthenticated && !activeExam.isDemo) {
                        fetch(`/api/exams/${activeExam.id}/submit`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userAnswers: activeExam.userAnswers,
                                status: "completed"
                            })
                        }).catch((err) => console.error("Failed to submit exam:", err));
                    }
                    router.push(`/result/${activeExam.id}`);
                }}
                title="Finish Exam?"
                description="Are you sure you want to finish the exam? You won't be able to change your answers after this."
                confirmLabel="Yes, Finish"
                cancelLabel="Cancel"
                confirmColor="primary"
                iconColor="brand"
            />

            <ConfirmationModal
                isOpen={isExitModalOpen}
                onClose={() => setIsExitModalOpen(false)}
                onConfirm={() => {
                    setIsExitModalOpen(false);
                    handleExit();
                }}
                title="Keluar dari Ujian?"
                description="Apakah kamu yakin ingin keluar? Ujian ini akan otomatis disimpan dan kamu dapat melanjutkannya nanti di Playground."
                confirmLabel="Ya, Keluar"
                cancelLabel="Batal"
                confirmColor="primary-destructive"
                iconColor="error"
            />

            <Modal
                isOpen={isShortcutModalOpen}
                onOpenChange={setIsShortcutModalOpen}
                title="Pintasan Keyboard (Keyboard Shortcuts)"
                description="Gunakan pintasan keyboard berikut untuk mempercepat navigasi dan pengisian jawaban:"
                icon={InfoCircle}
                iconTheme="modern"
                maxWidth="md"
                primaryAction={{
                    label: "Mengerti",
                    onClick: () => setIsShortcutModalOpen(false),
                    color: "primary"
                }}
            >
                <div className="flex flex-col gap-3 py-2 text-sm">
                    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                        <span className="font-medium text-primary">Validasi & Next Soal</span>
                        <kbd className="rounded border border-secondary bg-primary px-2.5 py-1 text-xs font-semibold text-primary shadow-xs">
                            Enter
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                        <span className="font-medium text-primary">Pindah Halaman Soal</span>
                        <div className="flex items-center gap-1.5">
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">
                                ←
                            </kbd>
                            <span className="text-tertiary text-xs">atau</span>
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">
                                →
                            </kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                        <span className="font-medium text-primary">Pilih Pilihan Ganda</span>
                        <div className="flex items-center gap-1">
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">1</kbd>
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">2</kbd>
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">3</kbd>
                            <kbd className="rounded border border-secondary bg-primary px-2 py-1 text-xs font-semibold text-primary shadow-xs">4</kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                        <span className="font-medium text-primary">Toggle Mic (Speaking) / Play Audio (Listening)</span>
                        <kbd className="w-35 rounded border border-secondary bg-primary px-2.5 py-1 text-xs font-semibold text-primary shadow-xs">
                            ⌘ + Enter / <br /> Ctrl + Enter
                        </kbd>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

