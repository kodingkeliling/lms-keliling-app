import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SkillType = "Reading" | "Writing" | "Speaking" | "Listening";

export interface Question {
    id: string;
    description: string;
    options: string[] | null;
    answer: string;
    skill: SkillType;
}

export interface ExamConfig {
    language: string;
    questionCount: number;
    skills: SkillType[];
    duration?: number | null; // in minutes; null or 0 means Unlimited
}

export type ExamStatus = "idle" | "generating" | "ongoing" | "completed";

export interface ExamAttempt {
    id: string;
    title?: string;
    createdAt: number;
    config: ExamConfig;
    questions: Question[];
    userAnswers: Record<string, string>;
    status: ExamStatus;
    currentQuestionIndex: number;
    startTime: number | null;
    endTime: number | null;
    ownedBy?: string;
    isDemo?: boolean;
    isPublic?: boolean;
}

interface ExamState {
    exams: ExamAttempt[];
    activeExamId: string | null;
    hasHydrated: boolean;

    // Actions
    setHasHydrated: (val: boolean) => void;
    createNewExam: (config: ExamConfig, ownedBy?: string, isDemo?: boolean, isPublic?: boolean) => string;
    selectExam: (id: string) => void;
    deleteExam: (id: string) => void;
    togglePublicExam: (id: string) => void;

    // Updates for the active exam
    setQuestions: (questions: Question[]) => void;
    setStatus: (status: ExamStatus) => void;
    setAnswer: (questionId: string, answer: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    goToQuestion: (index: number) => void;
    finishExam: () => void;
    retryActiveExam: () => void;
    startExam: () => void;
    addOrUpdateExam: (exam: ExamAttempt) => void;
    clearLocalExams: () => void;
}

export const useExamStore = create<ExamState>()(
    persist(
        (set, get) => ({
            exams: [],
            activeExamId: null,
            hasHydrated: false,

            setHasHydrated: (val) => set({ hasHydrated: val }),

            createNewExam: (config, ownedBy, isDemo = false, isPublic = false) => {
                const id = crypto.randomUUID();
                const newExam: ExamAttempt = {
                    id,
                    createdAt: Date.now(),
                    config,
                    questions: [],
                    userAnswers: {},
                    status: "idle",
                    currentQuestionIndex: 0,
                    startTime: null,
                    endTime: null,
                    ownedBy,
                    isDemo,
                    isPublic,
                };
                set((state) => ({
                    exams: [newExam, ...state.exams],
                    activeExamId: id,
                }));
                return id;
            },

            selectExam: (id) => set({ activeExamId: id }),

            deleteExam: (id) => set((state) => ({
                exams: state.exams.filter(e => e.id !== id),
                activeExamId: state.activeExamId === id ? null : state.activeExamId
            })),

            togglePublicExam: (id) => set((state) => ({
                exams: state.exams.map((e) => e.id === id ? { ...e, isPublic: !e.isPublic } : e)
            })),

            setQuestions: (questions) =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? { ...e, questions, status: "ongoing", startTime: null }
                            : e
                    ),
                })),

            setStatus: (status) =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId ? { ...e, status } : e
                    ),
                })),

            setAnswer: (questionId, answer) =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? { ...e, userAnswers: { ...e.userAnswers, [questionId]: answer } }
                            : e
                    ),
                })),

            nextQuestion: () =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? { ...e, currentQuestionIndex: Math.min(e.currentQuestionIndex + 1, e.questions.length - 1) }
                            : e
                    ),
                })),

            prevQuestion: () =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? { ...e, currentQuestionIndex: Math.max(e.currentQuestionIndex - 1, 0) }
                            : e
                    ),
                })),

            goToQuestion: (index) =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId ? { ...e, currentQuestionIndex: index } : e
                    ),
                })),

            finishExam: () =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId ? { ...e, status: "completed", endTime: Date.now() } : e
                    ),
                })),

            retryActiveExam: () =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? {
                                ...e,
                                status: "ongoing",
                                userAnswers: {},
                                currentQuestionIndex: 0,
                                startTime: Date.now(),
                                endTime: null,
                            }
                            : e
                    ),
                })),

            startExam: () =>
                set((state) => ({
                    exams: state.exams.map((e) =>
                        e.id === state.activeExamId
                            ? { ...e, startTime: Date.now(), status: "ongoing" }
                            : e
                    ),
                })),

            addOrUpdateExam: (exam) =>
                set((state) => {
                    const exists = state.exams.some((e) => e.id === exam.id);
                    if (exists) {
                        return {
                            exams: state.exams.map((e) => (e.id === exam.id ? { ...e, ...exam } : e)),
                        };
                    }
                    return {
                        exams: [exam, ...state.exams],
                    };
                }),

            clearLocalExams: () => set({ exams: [], activeExamId: null }),
        }),
        {
            name: "fraise-exam-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

// Helper selectors
export const useActiveExam = () => {
    const activeExamId = useExamStore((s) => s.activeExamId);
    const exams = useExamStore((s) => s.exams);
    return exams.find((e) => e.id === activeExamId) || null;
};
