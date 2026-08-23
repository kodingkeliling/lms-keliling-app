"use client";

import { useEffect, useState, useCallback } from "react";
import { CreditCard01, Plus, Edit01 } from "@untitledui/icons";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { DataTable, TableEmptyState } from "@/components/shared/data-table";
import { PlanBadge } from "@/components/base/badges/plan-badge";
import { Button } from "@/components/base/buttons/button";
import { Label } from "@/components/base/input/label";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PLANS } from "@/data/plans";

interface UserOption {
    id: string;
    name: string;
    email: string;
}

interface SubscriptionRow {
    id: string;
    userId: string;
    planId: string;
    planName: string;
    price: number;
    questions: number;
    createdAt: string;
    user: UserOption;
}

function toISOString(d: DateValue | null) {
    return d ? `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}` : null;
}

// ─── Add Subscription Slideout ────────────────────────────────────────────────

function AddSubscriptionSlideout({
    isOpen,
    onOpenChange,
    users,
    onSaved,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    users: UserOption[];
    onSaved: () => void;
}) {
    const [userId, setUserId] = useState<string>("");
    const [planId, setPlanId] = useState<string>(PLANS[0].id);
    const [price, setPrice] = useState<string>(String(PLANS[0].price));
    const [startDate, setStartDate] = useState<DateValue | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => onOpenChange(false);

    const handlePlanChange = (selected: string) => {
        setPlanId(selected);
        const p = PLANS.find((item) => item.id === selected);
        if (p) setPrice(String(p.price));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            if (!userId) throw new Error("Pilih pengguna terlebih dahulu.");
            const res = await fetch("/api/admin/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    planId,
                    price: Number(price),
                    startDate: toISOString(startDate),
                }),
            });
            if (!res.ok) throw new Error("Gagal menambah langganan.");
            onSaved();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
            <SlideoutMenu isDismissable>
                <SlideoutMenu.Header onClose={handleClose} className="flex w-full items-start gap-4">
                    <FeaturedIcon icon={Plus} color="brand" theme="light" size="md" />
                    <div className="flex flex-col gap-0.5 pr-10">
                        <h2 className="text-md font-semibold text-primary md:text-lg">Tambah Langganan</h2>
                        <p className="text-sm text-tertiary">Tambahkan transaksi langganan untuk user</p>
                    </div>
                </SlideoutMenu.Header>

                <SlideoutMenu.Content>
                    <div className="flex flex-col gap-1.5">
                        <Label>Pengguna</Label>
                        <Select
                            selectedKey={userId}
                            onSelectionChange={(k) => setUserId(k as string)}
                            placeholder="Pilih user..."
                        >
                            {users.map((u) => (
                                <Select.Item key={u.id} id={u.id} label={`${u.name || "User"} (${u.email})`}>
                                    {u.name ? `${u.name} (${u.email})` : u.email}
                                </Select.Item>
                            ))}
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Paket Langganan</Label>
                        <Select
                            selectedKey={planId}
                            onSelectionChange={(k) => handlePlanChange(k as string)}
                            placeholder="Pilih paket..."
                        >
                            {PLANS.map((p) => (
                                <Select.Item key={p.id} id={p.id} label={`${p.name} — Rp${p.price.toLocaleString("id-ID")}`}>
                                    {p.name} (Rp{p.price.toLocaleString("id-ID")})
                                </Select.Item>
                            ))}
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Harga Transaksi (Rp)</Label>
                        <Input type="number" value={price} onChange={(val) => setPrice(val)} placeholder="Nilai harga" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Tanggal Pembelian</Label>
                        <DatePicker
                            value={startDate}
                            onChange={setStartDate}
                            onApply={() => {}}
                            onCancel={() => setStartDate(null)}
                            fullWidth
                            placeholder="Pilih tanggal pembelian"
                        />
                    </div>

                    {error && <p className="text-sm text-error-primary">{error}</p>}
                </SlideoutMenu.Content>

                <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
                    <Button color="secondary" size="md" onClick={handleClose} isDisabled={isSaving}>
                        Batal
                    </Button>
                    <Button size="md" onClick={handleSave} isLoading={isSaving}>
                        Tambah Langganan
                    </Button>
                </SlideoutMenu.Footer>
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    );
}

// ─── Edit Subscription Slideout ───────────────────────────────────────────────

function EditSubscriptionSlideout({
    subscription,
    onOpenChange,
    onSaved,
}: {
    subscription: SubscriptionRow | null;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
}) {
    const [planId, setPlanId] = useState<string>(subscription?.planId ?? PLANS[0].id);
    const [price, setPrice] = useState<string>(String(subscription?.price ?? PLANS[0].price));
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!subscription) return;
        setPlanId(subscription.planId);
        setPrice(String(subscription.price));
        setError(null);
    }, [subscription]);

    const handleClose = () => onOpenChange(false);

    const handlePlanChange = (selected: string) => {
        setPlanId(selected);
        const p = PLANS.find((item) => item.id === selected);
        if (p) setPrice(String(p.price));
    };

    const handleSave = async () => {
        if (!subscription) return;

        setIsSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/subscriptions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: subscription.id,
                    planId,
                    price: Number(price),
                }),
            });
            if (!res.ok) throw new Error("Gagal mengedit langganan.");
            onSaved();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SlideoutMenu.Trigger isOpen={Boolean(subscription)} onOpenChange={onOpenChange}>
            <SlideoutMenu isDismissable>
                {subscription && (
                    <>
                        <SlideoutMenu.Header onClose={handleClose} className="flex w-full items-start gap-4">
                            <FeaturedIcon icon={Edit01} color="brand" theme="light" size="md" />
                            <div className="flex flex-col gap-0.5 pr-10">
                                <h2 className="text-md font-semibold text-primary md:text-lg">Edit Langganan</h2>
                                <p className="truncate text-sm text-tertiary">{subscription.user?.email}</p>
                            </div>
                        </SlideoutMenu.Header>

                        <SlideoutMenu.Content>
                            <div className="flex flex-col gap-1">
                                <Label>Pengguna</Label>
                                <p className="text-sm font-medium text-primary">{subscription.user?.name || "User"}</p>
                                <p className="text-xs text-tertiary">{subscription.user?.email}</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label>Tanggal Transaksi</Label>
                                <p className="text-sm text-tertiary">
                                    {new Date(subscription.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Paket Langganan</Label>
                                <Select
                                    selectedKey={planId}
                                    onSelectionChange={(k) => handlePlanChange(k as string)}
                                    placeholder="Pilih paket..."
                                >
                                    {PLANS.map((p) => (
                                        <Select.Item key={p.id} id={p.id} label={`${p.name} — Rp${p.price.toLocaleString("id-ID")}`}>
                                            {p.name} (Rp{p.price.toLocaleString("id-ID")})
                                        </Select.Item>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Harga Transaksi (Rp)</Label>
                                <Input type="number" value={price} onChange={(val) => setPrice(val)} placeholder="Nilai harga" />
                            </div>

                            {error && <p className="text-sm text-error-primary">{error}</p>}
                        </SlideoutMenu.Content>

                        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
                            <Button color="secondary" size="md" onClick={handleClose} isDisabled={isSaving}>
                                Batal
                            </Button>
                            <Button size="md" onClick={handleSave} isLoading={isSaving}>
                                Simpan Perubahan
                            </Button>
                        </SlideoutMenu.Footer>
                    </>
                )}
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    );
}

// ─── Main Admin Subscriptions Page ────────────────────────────────────────────

export default function DashboardSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<SubscriptionRow | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [resSubs, resUsers] = await Promise.all([
                fetch("/api/admin/subscriptions"),
                fetch("/api/admin/users"),
            ]);

            if (resSubs.ok) {
                const dataSubs = await resSubs.json();
                setSubscriptions(dataSubs.subscriptions);
            }
            if (resUsers.ok) {
                const dataUsers = await resUsers.json();
                setUsers(dataUsers.users.filter((u: UserOption & { role: string }) => u.role !== "SUPER_ADMIN"));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaved = () => {
        setIsAddOpen(false);
        setEditingSubscription(null);
        fetchData();
    };

    const COLUMNS = [
        {
            key: "user",
            label: "Pengguna",
            sortable: true,
            render: (row: SubscriptionRow) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-primary">{row.user?.name || "—"}</span>
                    <span className="text-xs text-tertiary">{row.user?.email}</span>
                </div>
            ),
        },
        {
            key: "planName",
            label: "Paket",
            render: (row: SubscriptionRow) => <PlanBadge label={row.planName} size="sm" />,
        },
        {
            key: "price",
            label: "Harga",
            sortable: true,
            render: (row: SubscriptionRow) => (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Rp{row.price.toLocaleString("id-ID")}
                </span>
            ),
        },
        {
            key: "questions",
            label: "Kuota Soal",
            render: (row: SubscriptionRow) => <span className="text-sm text-tertiary">{row.questions} soal</span>,
        },
        {
            key: "createdAt",
            label: "Tanggal Transaksi",
            sortable: true,
            render: (row: SubscriptionRow) => (
                <span className="text-sm text-tertiary">
                    {new Date(row.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            ),
        },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden">
            <div className="flex items-start justify-between gap-4">
                <DashboardPageHeader
                    icon={CreditCard01}
                    title="Riwayat Langganan"
                    description="Kelola dan tambah riwayat transaksi langganan pengguna."
                />
                <Button iconLeading={Plus} size="sm" onClick={() => setIsAddOpen(true)} className="mt-1 shrink-0">
                    Tambah Langganan
                </Button>
            </div>

            <DataTable
                title="Daftar Langganan"
                description="Semua transaksi langganan terdaftar"
                badge={subscriptions.length}
                columns={COLUMNS}
                data={subscriptions}
                isLoading={isLoading}
                searchable
                searchFields={["planName"]}
                onEdit={(row) => setEditingSubscription(row)}
                rowActions
                pageSize={10}
                emptyState={
                    <TableEmptyState
                        title="Belum ada riwayat langganan"
                        description="Tambahkan transaksi langganan pertama untuk mulai mencatat riwayat pengguna."
                        iconProps={{ icon: CreditCard01 }}
                        action={{
                            label: "Tambah Langganan",
                            iconLeading: Plus,
                            onClick: () => setIsAddOpen(true),
                        }}
                    />
                }
            />

            <AddSubscriptionSlideout
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                users={users}
                onSaved={handleSaved}
            />

            <EditSubscriptionSlideout
                subscription={editingSubscription}
                onOpenChange={(open) => {
                    if (!open) setEditingSubscription(null);
                }}
                onSaved={handleSaved}
            />
        </div>
    );
}
