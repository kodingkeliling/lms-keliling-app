"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail01, Trash01, UserPlus01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { DataTable } from "@/components/shared/data-table";
import { ExamFormModal } from "@/components/dashboard/exam-form-modal";
import { InviteModal } from "@/components/dashboard/invite-modal";
import { useDashboardStore, type DashboardExam, type DashboardQuestion } from "@/store/use-dashboard-store";

const STATUS_LABEL: Record<DashboardExam["status"], string> = {
    draft: "Draft",
    active: "Aktif",
    closed: "Ditutup",
};
const STATUS_COLOR: Record<DashboardExam["status"], "gray" | "brand" | "error"> = {
    draft: "gray",
    active: "brand",
    closed: "error",
};

const QUESTION_COLUMNS = [
    {
        key: "skill",
        label: "Skill",
        sortable: true,
        render: (row: DashboardQuestion) => (
            <Badge color="brand" type="pill-color" size="sm">{row.skill}</Badge>
        ),
    },
    {
        key: "description",
        label: "Pertanyaan",
        render: (row: DashboardQuestion) => (
            <span className="line-clamp-2 text-sm text-secondary">{row.description}</span>
        ),
    },
    {
        key: "answer",
        label: "Jawaban",
        render: (row: DashboardQuestion) => (
            <span className="text-sm text-tertiary">{row.answer}</span>
        ),
    },
];

const INVITEE_COLUMNS = [
    {
        key: "email",
        label: "Email",
        sortable: true,
        render: (row: { id: string; email: string; invitedAt: number }) => (
            <div className="flex items-center gap-2">
                <Mail01 className="size-4 text-tertiary" />
                <span className="text-sm text-secondary">{row.email}</span>
            </div>
        ),
    },
    {
        key: "invitedAt",
        label: "Diundang",
        render: (row: { id: string; email: string; invitedAt: number }) => (
            <span className="text-sm text-tertiary">
                {new Date(row.invitedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </span>
        ),
    },
];

export default function ExamDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { exams, questions, deleteExam, removeInvitee } = useDashboardStore();

    const [editOpen, setEditOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    const exam = exams.find((e) => e.id === id);

    if (!exam) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <p className="text-lg font-semibold text-primary">Ujian tidak ditemukan</p>
                <Button color="secondary" iconLeading={ArrowLeft} onClick={() => router.push("/dashboard/exams")}>
                    Kembali
                </Button>
            </div>
        );
    }

    const examQuestions = questions.filter((q) => exam.questionIds.includes(q.id));

    const handleDelete = () => {
        deleteExam(exam.id);
        router.push("/dashboard/exams");
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    color="tertiary"
                    size="sm"
                    iconLeading={ArrowLeft}
                    onClick={() => router.push("/dashboard/exams")}
                    className="self-start"
                >
                    Kembali
                </Button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-display-xs font-semibold text-primary">{exam.title}</h1>
                            <Badge color={STATUS_COLOR[exam.status]} type="pill-color" size="md">
                                {STATUS_LABEL[exam.status]}
                            </Badge>
                        </div>
                        {exam.description && (
                            <p className="text-sm text-tertiary max-w-xl">{exam.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                            {exam.skills.map((skill) => (
                                <Badge key={skill} color="gray" type="pill-color" size="sm">{skill}</Badge>
                            ))}
                            <Badge color="gray" type="color" size="sm">{exam.language}</Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" color="secondary" iconLeading={UserPlus01} onClick={() => setInviteOpen(true)}>
                            Undang
                        </Button>
                        <Button size="sm" color="secondary" onClick={() => setEditOpen(true)}>
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            color="primary-destructive"
                            iconLeading={Trash01}
                            onClick={handleDelete}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <DataTable
                title="Soal dalam Ujian"
                badge={examQuestions.length}
                columns={QUESTION_COLUMNS}
                data={examQuestions}
                searchFields={["description", "skill", "answer"]}
                rowActions={false}
                emptyState={
                    <span className="text-sm text-tertiary">
                        Belum ada soal. Tambahkan dari halaman Soal lalu pilih soal saat edit ujian.
                    </span>
                }
            />

            {/* Invitees */}
            <DataTable
                title="Peserta Diundang"
                badge={exam.invitees.length}
                columns={INVITEE_COLUMNS}
                data={exam.invitees}
                searchFields={["email"]}
                addLabel="Undang"
                onAdd={() => setInviteOpen(true)}
                onDelete={(row) => removeInvitee(exam.id, row.id)}
                emptyState={
                    <span className="text-sm text-tertiary">
                        Belum ada peserta. Klik &ldquo;Undang&rdquo; untuk mengundang.
                    </span>
                }
            />

            <ExamFormModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialData={exam}
            />

            <InviteModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                examId={exam.id}
            />
        </div>
    );
}
