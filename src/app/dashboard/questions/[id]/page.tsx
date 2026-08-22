"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { QuestionFormModal } from "@/components/dashboard/question-form-modal";
import { useDashboardStore } from "@/store/use-dashboard-store";

export default function QuestionDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { questions, exams, deleteQuestion } = useDashboardStore();

    const [editOpen, setEditOpen] = useState(false);

    const question = questions.find((q) => q.id === id);

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <p className="text-lg font-semibold text-primary">Soal tidak ditemukan</p>
                <Button color="secondary" iconLeading={ArrowLeft} onClick={() => router.push("/dashboard/questions")}>
                    Kembali
                </Button>
            </div>
        );
    }

    // Exams that use this question
    const usedInExams = exams.filter((e) => e.questionIds.includes(question.id));

    const handleDelete = () => {
        deleteQuestion(question.id);
        router.push("/dashboard/questions");
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Back button */}
            <Button
                color="tertiary"
                size="sm"
                iconLeading={ArrowLeft}
                onClick={() => router.push("/dashboard/questions")}
                className="self-start"
            >
                Kembali
            </Button>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge color="brand" type="pill-color" size="md">{question.skill}</Badge>
                        <Badge color="gray" type="color" size="md">{question.language}</Badge>
                        <Badge color="gray" type="color" size="md">
                            {question.options ? "Pilihan Ganda" : "Essay"}
                        </Badge>
                    </div>
                    <p className="text-sm text-tertiary">
                        Dibuat {new Date(question.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" color="secondary" onClick={() => setEditOpen(true)}>
                        Edit
                    </Button>
                    <Button size="sm" color="primary-destructive" iconLeading={Trash01} onClick={handleDelete}>
                        Hapus
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
                {/* Question text */}
                <div className="rounded-xl border border-secondary bg-primary p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">Pertanyaan</p>
                    <p className="text-base text-primary leading-relaxed">{question.description}</p>
                </div>

                {/* Options if multiple choice */}
                {question.options && question.options.length > 0 && (
                    <div className="rounded-xl border border-secondary bg-primary p-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-tertiary">Pilihan Jawaban</p>
                        <ul className="flex flex-col gap-2">
                            {question.options.map((opt, i) => (
                                <li
                                    key={i}
                                    className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
                                        opt === question.answer
                                            ? "bg-success-50 text-success-700 ring-1 ring-success-200 dark:bg-success-900/20 dark:text-success-400 dark:ring-success-800"
                                            : "bg-secondary text-secondary"
                                    }`}
                                >
                                    <span className="font-semibold shrink-0">
                                        {String.fromCharCode(65 + i)}.
                                    </span>
                                    {opt}
                                    {opt === question.answer && (
                                        <Badge color="success" type="pill-color" size="sm" className="ml-auto shrink-0">
                                            Jawaban
                                        </Badge>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Essay answer */}
                {!question.options && (
                    <div className="rounded-xl border border-secondary bg-primary p-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">Kunci Jawaban</p>
                        <p className="text-base text-primary leading-relaxed">{question.answer}</p>
                    </div>
                )}

                {/* Used in exams */}
                {usedInExams.length > 0 && (
                    <div className="rounded-xl border border-secondary bg-primary p-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            Digunakan dalam {usedInExams.length} Ujian
                        </p>
                        <ul className="flex flex-col gap-2">
                            {usedInExams.map((exam) => (
                                <li key={exam.id}>
                                    <button
                                        onClick={() => router.push(`/dashboard/exams/${exam.id}`)}
                                        className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                                    >
                                        {exam.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <QuestionFormModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialData={question}
            />
        </div>
    );
}
