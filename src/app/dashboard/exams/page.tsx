"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookClosed, Plus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { DataTable, TableEmptyState } from "@/components/shared/data-table";
import { ExamFormModal } from "@/components/dashboard/exam-form-modal";
import { useDashboardStore, type DashboardExam } from "@/store/use-dashboard-store";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

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

const COLUMNS = [
    {
        key: "title",
        label: "Judul",
        sortable: true,
        render: (row: DashboardExam) => (
            <div className="flex flex-col gap-0.5">
                <span className="font-medium text-primary">{row.title}</span>
                {row.description && (
                    <span className="text-xs text-tertiary line-clamp-1">{row.description}</span>
                )}
            </div>
        ),
    },
    {
        key: "language",
        label: "Bahasa",
        sortable: true,
        render: (row: DashboardExam) => (
            <span className="text-sm text-secondary">{row.language}</span>
        ),
    },
    {
        key: "questionIds",
        label: "Soal",
        render: (row: DashboardExam) => (
            <span className="text-sm text-secondary">{row.questionIds.length} soal</span>
        ),
    },
    {
        key: "invitees",
        label: "Peserta",
        render: (row: DashboardExam) => (
            <span className="text-sm text-secondary">{row.invitees.length} orang</span>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (row: DashboardExam) => (
            <Badge color={STATUS_COLOR[row.status]} type="pill-color" size="sm">
                {STATUS_LABEL[row.status]}
            </Badge>
        ),
    },
    {
        key: "createdAt",
        label: "Dibuat",
        sortable: true,
        render: (row: DashboardExam) => (
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

export default function ExamsPage() {
    const router = useRouter();
    const { exams, deleteExam } = useDashboardStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<DashboardExam | null>(null);

    const handleAdd = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const handleEdit = (row: DashboardExam) => {
        setEditTarget(row);
        setModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            <DashboardPageHeader
                icon={BookClosed}
                title="Ujian"
                description="Kelola ujian, tambah soal, dan undang peserta."
            />

            <DataTable
                title="Daftar Ujian"
                badge={exams.length}
                columns={COLUMNS}
                data={exams}
                searchFields={["title", "language", "description"]}
                addLabel="Buat Ujian"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(row) => deleteExam(row.id)}
                onRowClick={(row) => router.push(`/dashboard/exams/${row.id}`)}
                emptyState={
                    <TableEmptyState
                        title="Belum ada ujian"
                        description="Klik “Buat Ujian” untuk membuat ujian pertama Anda."
                        iconProps={{ icon: BookClosed }}
                        action={{
                            label: "Buat Ujian",
                            iconLeading: Plus,
                            onClick: handleAdd,
                        }}
                    />
                }
            />

            <ExamFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={editTarget}
            />
        </div>
    );
}
