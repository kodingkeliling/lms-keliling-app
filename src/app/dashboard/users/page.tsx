"use client";

import { useEffect, useState, useCallback } from "react";
import { Users01, CheckCircle, XCircle } from "@untitledui/icons";
import { DataTable, TableEmptyState } from "@/components/shared/data-table";
import { Badge } from "@/components/base/badges/badges";
import { PlanBadge } from "@/components/base/badges/plan-badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PLANS } from "@/data/plans";

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    planId: string | null;
    planStartDate: string | null;
    planEndDate: string | null;
    isVerified: boolean;
    createdAt: string;
}

function UserPlanBadge({ planId }: { planId: string | null }) {
    const plan = PLANS.find((p) => p.id === planId);
    const label = plan ? plan.name : "Free";
    return <PlanBadge label={label} size="sm" />;
}

function PlanDateRange({ start, end }: { start: string | null; end: string | null }) {
    if (!start && !end) return <span className="text-sm text-quaternary">—</span>;
    const fmt = (d: string | null) =>
        d
            ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "—";
    const isExpired = end ? new Date(end) < new Date() : false;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-tertiary">{fmt(start)} → {fmt(end)}</span>
            {isExpired && (
                <Badge size="sm" type="pill-color" color="error">Kadaluwarsa</Badge>
            )}
        </div>
    );
}

export default function DashboardUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                // Filter out Super Admin users from the list if needed, or keep non-superadmin
                setUsers(data.users.filter((u: UserRow) => u.role !== "SUPER_ADMIN"));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const COLUMNS = [
        {
            key: "name",
            label: "Nama",
            sortable: true,
            render: (row: UserRow) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-primary">{row.name || "—"}</span>
                    <span className="text-xs text-tertiary">{row.email}</span>
                </div>
            ),
        },
        {
            key: "isVerified",
            label: "Terverifikasi",
            render: (row: UserRow) =>
                row.isVerified ? (
                    <CheckCircle className="size-4 text-emerald-500" />
                ) : (
                    <XCircle className="size-4 text-error-500" />
                ),
        },
        {
            key: "planId",
            label: "Paket",
            render: (row: UserRow) => <UserPlanBadge planId={row.planId} />,
        },
        {
            key: "planEndDate",
            label: "Masa Aktif",
            render: (row: UserRow) => (
                <PlanDateRange start={row.planStartDate} end={row.planEndDate} />
            ),
        },
        {
            key: "createdAt",
            label: "Bergabung",
            sortable: true,
            render: (row: UserRow) => (
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

    return (
        <div className="flex flex-1 flex-col gap-6 h-full overflow-hidden">
            <DashboardPageHeader
                icon={Users01}
                title="Manajemen User"
                description="Daftar seluruh pengguna terdaftar di LMS Keliling."
            />

            <DataTable
                title="Daftar User"
                description="Pengguna aktif"
                badge={users.length}
                columns={COLUMNS}
                data={users}
                isLoading={isLoading}
                searchable
                searchFields={["name", "email"]}
                rowActions={false}
                pageSize={10}
                emptyState={
                    <TableEmptyState
                        title="Belum ada user"
                        description="Pengguna yang terdaftar akan muncul di sini."
                        iconProps={{ icon: Users01 }}
                    />
                }
            />
        </div>
    );
}
