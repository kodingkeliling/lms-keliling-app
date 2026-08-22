import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SkillType } from "./use-exam-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardQuestion {
    id: string;
    skill: SkillType;
    language: string;
    description: string;
    options: string[] | null;
    answer: string;
    createdAt: number;
}

export type ExamStatusDashboard = "draft" | "active" | "closed";

export interface DashboardExamInvitee {
    id: string;
    email: string;
    invitedAt: number;
}

export interface DashboardExam {
    id: string;
    title: string;
    description: string;
    language: string;
    skills: SkillType[];
    questionIds: string[];   // references to DashboardQuestion.id
    invitees: DashboardExamInvitee[];
    status: ExamStatusDashboard;
    createdAt: number;
    updatedAt: number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface DashboardState {
    exams: DashboardExam[];
    questions: DashboardQuestion[];

    // Exam actions
    createExam: (data: Omit<DashboardExam, "id" | "createdAt" | "updatedAt">) => string;
    updateExam: (id: string, data: Partial<Omit<DashboardExam, "id" | "createdAt">>) => void;
    deleteExam: (id: string) => void;
    inviteToExam: (examId: string, email: string) => void;
    removeInvitee: (examId: string, inviteeId: string) => void;

    // Question actions
    createQuestion: (data: Omit<DashboardQuestion, "id" | "createdAt">) => string;
    updateQuestion: (id: string, data: Partial<Omit<DashboardQuestion, "id" | "createdAt">>) => void;
    deleteQuestion: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            exams: [],
            questions: [],

            // ── Exam ──────────────────────────────────────────────────────────
            createExam: (data) => {
                const id = crypto.randomUUID();
                const now = Date.now();
                set((s) => ({
                    exams: [{ ...data, id, createdAt: now, updatedAt: now }, ...s.exams],
                }));
                return id;
            },

            updateExam: (id, data) =>
                set((s) => ({
                    exams: s.exams.map((e) =>
                        e.id === id ? { ...e, ...data, updatedAt: Date.now() } : e
                    ),
                })),

            deleteExam: (id) =>
                set((s) => ({ exams: s.exams.filter((e) => e.id !== id) })),

            inviteToExam: (examId, email) =>
                set((s) => ({
                    exams: s.exams.map((e) => {
                        if (e.id !== examId) return e;
                        if (e.invitees.some((i) => i.email === email)) return e;
                        return {
                            ...e,
                            invitees: [
                                ...e.invitees,
                                { id: crypto.randomUUID(), email, invitedAt: Date.now() },
                            ],
                            updatedAt: Date.now(),
                        };
                    }),
                })),

            removeInvitee: (examId, inviteeId) =>
                set((s) => ({
                    exams: s.exams.map((e) =>
                        e.id === examId
                            ? {
                                  ...e,
                                  invitees: e.invitees.filter((i) => i.id !== inviteeId),
                                  updatedAt: Date.now(),
                              }
                            : e
                    ),
                })),

            // ── Question ──────────────────────────────────────────────────────
            createQuestion: (data) => {
                const id = crypto.randomUUID();
                set((s) => ({
                    questions: [{ ...data, id, createdAt: Date.now() }, ...s.questions],
                }));
                return id;
            },

            updateQuestion: (id, data) =>
                set((s) => ({
                    questions: s.questions.map((q) =>
                        q.id === id ? { ...q, ...data } : q
                    ),
                })),

            deleteQuestion: (id) =>
                set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
        }),
        { name: "lms-keliling-dashboard-storage" }
    )
);
