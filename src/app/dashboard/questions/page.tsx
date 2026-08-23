"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen01, Plus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { DataTable, TableEmptyState } from "@/components/shared/data-table";
import { QuestionFormModal } from "@/components/dashboard/question-form-modal";
import { useDashboardStore, type DashboardQuestion } from "@/store/use-dashboard-store";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

const COLUMNS = [
    {
        key: "skill",
        label: "Skill",
        sortable: true,
        render: (row: DashboardQuestion) => (
            <Badge color="brand" type="pill-color" size="sm">{row.skill}</Badge>
        ),
    },
    {
        key: "language",
        label: "Bahasa",
        sortable: true,
        render: (row: DashboardQuestion) => (
            <span className="text-sm text-secondary">{row.language}</span>
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
        key: "options",
        label: "Tipe",
        render: (row: DashboardQuestion) => (
            <Badge color="gray" type="color" size="sm">
                {row.options ? "Pilihan Ganda" : "Essay"}
            </Badge>
        ),
    },
    {
        key: "createdAt",
        label: "Dibuat",
        sortable: true,
        render: (row: DashboardQuestion) => (
            <span className="text-sm text-tertiary">
                {new Date(row.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </span>
        ),
    },
];

export default function QuestionsPage() {
    const router = useRouter();
    const { questions, deleteQuestion } = useDashboardStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<DashboardQuestion | null>(null);

    const handleAdd = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const handleEdit = (row: DashboardQuestion) => {
        setEditTarget(row);
        setModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            <DashboardPageHeader
                icon={BookOpen01}
                title="Bank Soal"
                description="Kelola semua soal yang tersedia untuk digunakan dalam ujian."
            />

            <DataTable
                title="Daftar Soal"
                badge={questions.length}
                columns={COLUMNS}
                data={questions}
                searchFields={["description", "language", "skill", "answer"]}
                addLabel="Tambah Soal"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(row) => deleteQuestion(row.id)}
                onRowClick={(row) => router.push(`/dashboard/questions/${row.id}`)}
                emptyState={
                    <TableEmptyState
                        title="Belum ada soal"
                        description="Klik “Tambah Soal” untuk menambahkan soal pertama ke bank soal."
                        iconProps={{ icon: BookOpen01 }}
                        action={{
                            label: "Tambah Soal",
                            iconLeading: Plus,
                            onClick: handleAdd,
                        }}
                    />
                }
            />

            <QuestionFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={editTarget}
            />
        </div>
    );
}
