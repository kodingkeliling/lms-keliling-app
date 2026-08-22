"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExamStore, ExamAttempt, ExamStatus, SkillType } from "@/store/use-exam-store";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    Play,
    Trash01,
    Plus,
    PlusCircle,
    SearchLg,
    FilterLines,
    UserPlus01,
    X,
    Mail01,
    Send01,
    LogOut01,
    ChevronDown,
    ChevronUp,
} from "@untitledui/icons";
import { MCPGuideModal } from "@/components/layout/mcp-guide-modal";
import InviteModal from "@/components/layout/invite-modal";
import ConfirmationModal from "@/components/layout/confirmation-modal";



// ─── Exam Card ─────────────────────────────────────────────────────────────────

const SKILL_COLORS: Record<string, string> = {
    Reading: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    Writing: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
    Speaking: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
    Listening: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
};

interface ExamCardProps {
    exam: ExamAttempt;
    currentEmail?: string;
    onInvite: (id: string) => void;
}

function ExamCard({ exam, currentEmail, onInvite }: ExamCardProps) {
    const router = useRouter();
    const { deleteExam } = useExamStore();

    const handleAction = () => {
        if (exam.status === "completed") {
            router.push(`/result/${exam.id}`);
        } else {
            router.push(`/playground/${exam.id}`);
        }
    };

    const isOwner = !exam.ownedBy || exam.ownedBy === currentEmail;

    const statusLabel =
        exam.status === "completed" ? "Selesai"
            : exam.status === "ongoing"
                ? (exam.startTime === null ? "Belum dimulai" : "Sedang berlangsung")
                : exam.status === "generating" ? "Generating..."
                    : "Belum dimulai";

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div className="group relative flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs transition-all hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800">
            {/* Status badge + delete/leave button */}
            <div className="flex items-start justify-between gap-2">
                <div className={cx(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit",
                    exam.status === "completed"
                        ? "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-300"
                        : exam.status === "ongoing"
                            ? (exam.startTime === null
                                ? "bg-warning-50 text-warning-700 dark:bg-warning-950/30 dark:text-warning-300"
                                : "bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300")
                            : "bg-secondary text-secondary"
                )}>
                    {exam.status === "completed" ? <CheckCircle className="size-3" /> : <Play className="size-3" />}
                    {statusLabel}
                </div>

                <Button
                    size="sm"
                    iconLeading={isOwner ? Trash01 : LogOut01}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex size-7 items-center justify-center rounded-lg text-tertiary hover:bg-error-50 hover:text-error-600 dark:hover:bg-red-950/20"
                    title={isOwner ? "Hapus ujian" : "Tinggalkan ujian"}
                    color="link-destructive"
                    onClick={() => setIsConfirmOpen(true)}
                />

                <ConfirmationModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={() => {
                        deleteExam(exam.id);
                        setIsConfirmOpen(false);
                    }}
                    title={isOwner ? "Konfirmasi Hapus Ujian" : "Konfirmasi Tinggalkan Ujian"}
                    description={`Apakah Anda yakin ingin ${isOwner ? "menghapus" : "meninggalkan"} ujian ini? Tindakan ini tidak dapat dibatalkan.`}
                    confirmLabel={isOwner ? "Hapus Ujian" : "Tinggalkan"}
                    cancelLabel="Batal"
                    confirmColor="primary-destructive"
                    iconColor="error"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-primary">
                    {exam.config.questionCount} Soal · {exam.config.language}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {exam.config.skills.map((skill) => (
                        <span
                            key={skill}
                            className={cx("rounded-md px-2 py-0.5 text-[10px] font-semibold", SKILL_COLORS[skill] ?? "bg-secondary text-secondary")}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Meta + actions */}
            <div className="flex items-center justify-between pt-1 border-t border-secondary gap-2 flex-wrap">
                <div className="flex items-center gap-3 text-xs text-tertiary flex-wrap">
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(exam.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(exam.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    {/* Owner Badge */}
                    {!isOwner && exam.ownedBy && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-500/20">
                            Undangan: {exam.ownedBy.split("@")[0]}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Hide Invite button if not owner */}
                    {isOwner && (
                        <Button
                            onClick={() => onInvite(exam.id)}
                            size="sm"
                            color="secondary"
                            iconLeading={UserPlus01}
                            title="Undang peserta"
                        >
                            Undang
                        </Button>
                    )}
                    <Button
                        size="sm"
                        color={exam.status === "completed" ? "secondary" : "primary"}
                        iconTrailing={ArrowRight}
                        onClick={handleAction}
                    >
                        {exam.status === "completed" ? "Lihat Hasil" : (exam.startTime === null ? "Mulai" : "Lanjutkan")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

type FilterStatus = "all" | ExamStatus;
type FilterSource = "all" | "self" | "invited";

const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "Semua Status" },
    { key: "ongoing", label: "Berlangsung" },
    { key: "completed", label: "Selesai" },
    { key: "idle", label: "Belum Mulai" },
];

const SOURCE_FILTERS: { key: FilterSource; label: string }[] = [
    { key: "all", label: "Semua Sumber" },
    { key: "self", label: "Dibuat Saya" },
    { key: "invited", label: "Undangan Teman" },
];

const ALL_SKILLS: SkillType[] = ["Reading", "Writing", "Speaking", "Listening"];

export const PlaygroundExamList = () => {
    const exams = useExamStore((s) => s.exams);
    const hasHydrated = useExamStore((s) => s.hasHydrated);
    const user = useAuthStore((s) => s.user);
    const [search, setSearch] = useState("");
    const [mcpModalOpen, setMcpModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [filterSource, setFilterSource] = useState<FilterSource>("all");
    const [filterSkills, setFilterSkills] = useState<SkillType[]>([]);
    const [inviteExamId, setInviteExamId] = useState<string | null>(null);
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

    const toggleSkill = (skill: SkillType) => {
        setFilterSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    useEffect(() => {
        if (!user) return;
        fetch("/api/exams")
            .then((res) => res.json())
            .then((data) => {
                if (data.exams && Array.isArray(data.exams)) {
                    data.exams.forEach((exam: any) => {
                        useExamStore.getState().addOrUpdateExam(exam);
                    });
                }
            })
            .catch((err) => console.error("Failed to sync exams from server:", err));
    }, [user]);

    const processed = useMemo(() => {
        let list = [...exams];

        // Status Filter
        if (filterStatus !== "all") {
            list = list.filter((e) => e.status === filterStatus);
        }

        // Source Filter
        if (filterSource !== "all") {
            list = list.filter((e) => {
                const isOwner = !e.ownedBy || e.ownedBy === user?.email;
                return filterSource === "self" ? isOwner : !isOwner;
            });
        }

        // Skill Filter
        if (filterSkills.length > 0) {
            list = list.filter((e) =>
                filterSkills.every((skill) => e.config.skills.includes(skill))
            );
        }

        // Search text Filter
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (e) =>
                    e.config.language.toLowerCase().includes(q) ||
                    e.config.skills.some((s) => s.toLowerCase().includes(q))
            );
        }

        list.sort((a, b) => {
            const statusOrder: Record<string, number> = { ongoing: 0, generating: 1, idle: 2, completed: 3 };
            const ao = statusOrder[a.status] ?? 99;
            const bo = statusOrder[b.status] ?? 99;
            if (ao !== bo) return ao - bo;
            return b.createdAt - a.createdAt;
        });

        return list;
    }, [exams, search, filterStatus, filterSource, filterSkills, user?.email]);

    const hasActiveFilter = filterStatus !== "all" || filterSource !== "all" || filterSkills.length > 0 || search.trim();

    return (<>
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-primary">Ujian &amp; Soal Saya</h2>
                    <p className="text-sm text-tertiary mt-0.5 flex items-center gap-1">
                        {hasHydrated ? (
                            <span className="font-medium text-primary">{exams.length}</span>
                        ) : (
                            <span className="inline-block h-4 w-5 rounded bg-secondary animate-pulse" />
                        )}
                        <span>ujian tersimpan</span>
                    </p>
                </div>
                <Button size="sm" iconLeading={Plus} onClick={() => setMcpModalOpen(true)}>
                    Tambah
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <SearchLg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari bahasa atau skill..."
                    className="w-full h-10 pl-9 pr-9 rounded-lg border border-secondary bg-primary text-sm text-primary placeholder-tertiary outline-none focus:ring-2 ring-brand-500 focus:border-brand-400 transition-all"
                />
                {search && (
                    <Button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-tertiary hover:text-primary transition-colors"
                        size="sm"
                        color="secondary"
                    >
                        <X className="size-3.5" />
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-2.5">
                {/* Source filter */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <FilterLines className="size-3.5 text-tertiary shrink-0" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mr-0.5 w-[50px]">Sumber</span>
                        {SOURCE_FILTERS.map((s) => (
                            <Button
                                key={s.key}
                                onClick={() => setFilterSource(s.key)}
                                className={cx(
                                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors border",
                                    filterSource === s.key
                                        ? "bg-brand-600 text-white border-brand-600"
                                        : "bg-primary text-secondary border-secondary hover:border-brand-400 hover:text-brand-700"
                                )}
                                size="sm"
                                color={filterSource === s.key ? "primary" : "secondary"}
                            >
                                {s.label}
                            </Button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                        size="sm"
                        color="secondary"
                        iconTrailing={isFiltersExpanded ? ChevronUp : ChevronDown}
                    >
                        Filter Lainnya
                    </Button>
                </div>

                {/* Collapsible filters container */}
                <div className={cx(
                    "grid transition-all duration-300 ease-in-out",
                    isFiltersExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-2.5 md:mt-0.5"
                        : "grid-rows-[1fr] opacity-100 md:grid-rows-[0fr] md:opacity-0 md:overflow-hidden mt-2.5 md:mt-0"
                )}>
                    <div className="min-h-0 flex flex-col gap-2.5">
                        {/* Status filter */}
                        <div className="flex items-center gap-1.5 flex-wrap py-0.5">
                            <span className="size-3.5 shrink-0" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mr-0.5 w-[50px]">Status</span>
                            {STATUS_FILTERS.map((f) => (
                                <Button
                                    key={f.key}
                                    onClick={() => setFilterStatus(f.key)}
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold transition-colors border",
                                        filterStatus === f.key
                                            ? "bg-brand-600 text-white border-brand-600"
                                            : "bg-primary text-secondary border-secondary hover:border-brand-400 hover:text-brand-700"
                                    )}
                                    size="sm"
                                    color="secondary"
                                >
                                    {f.label}
                                </Button>
                            ))}
                        </div>

                        {/* Skill filter (multi-select) */}
                        <div className="flex items-center gap-1.5 flex-wrap py-0.5">
                            <span className="size-3.5 shrink-0" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mr-0.5 w-[50px]">Skill</span>
                            {ALL_SKILLS.map((skill) => (
                                <Button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold transition-colors border",
                                        filterSkills.includes(skill)
                                            ? SKILL_COLORS[skill]?.replace("bg-", "border-") + " " + SKILL_COLORS[skill]
                                            : "bg-primary text-secondary border-secondary hover:border-brand-400 hover:text-brand-700"
                                    )}
                                    size="sm"
                                    color="secondary"
                                >
                                    {skill}
                                </Button>
                            ))}
                            {filterSkills.length > 0 && (
                                <Button
                                    onClick={() => setFilterSkills([])}
                                    className="text-[10px] text-tertiary hover:text-primary transition-colors underline ml-2 cursor-pointer"
                                    size="sm"
                                    color="secondary"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            {!hasHydrated ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col gap-3 rounded-2xl border border-secondary bg-primary p-4 md:p-5 shadow-xs animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-20 rounded-md bg-secondary" />
                                    <div className="h-5 w-16 rounded-md bg-secondary" />
                                </div>
                                <div className="h-6 w-24 rounded-full bg-secondary" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-28 rounded bg-secondary" />
                                <div className="h-4 w-36 rounded bg-secondary" />
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-secondary">
                                <div className="h-4 w-32 rounded bg-secondary" />
                                <div className="h-8 w-24 rounded-lg bg-secondary" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : processed.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-secondary bg-secondary/30 py-14 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/30">
                        <PlusCircle className="size-7 text-brand-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-primary">
                            {hasActiveFilter ? "Tidak ada hasil" : "Belum ada ujian"}
                        </p>
                        <p className="text-xs text-tertiary">
                            {hasActiveFilter
                                ? "Coba ubah kata kunci atau filter."
                                : "Buat ujian pertama dari form di atas!"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {processed.map((exam) => (
                        <ExamCard
                            key={exam.id}
                            exam={exam}
                            currentEmail={user?.email}
                            onInvite={(id) => setInviteExamId(id)}
                        />
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {inviteExamId && (
                <InviteModal examId={inviteExamId!} isOpen={true} onClose={() => setInviteExamId(null)} />
            )}
        </div>
        <MCPGuideModal isOpen={mcpModalOpen} onClose={() => setMcpModalOpen(false)} />
    </>);
};
