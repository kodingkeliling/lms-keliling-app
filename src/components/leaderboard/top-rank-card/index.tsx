"use client";

import { FC, ReactNode } from "react";
import { Trophy01, Zap, CheckCircle, ArrowRight, Award05 } from "@untitledui/icons";
import { Badge, BadgeWithIcon } from "@/components/base/badges/badges";
import { PlanBadge } from "@/components/base/badges/plan-badge";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";
import { LeaderboardUser } from "../index";
import { cx } from "@/utils/cx";

// ─── Reusable Stat Item Sub-Component ─────────────────────────────────────────
interface StatItemProps {
    value: ReactNode;
    label: string;
    icon?: FC<{ className?: string }>;
    iconClassName?: string;
    valueClassName?: string;
    hasBorderLeft?: boolean;
}

const StatItem = ({
    value,
    label,
    icon: Icon,
    iconClassName = "size-4 text-brand-500",
    valueClassName = "text-brand-600 dark:text-brand-400",
    hasBorderLeft = false,
}: StatItemProps) => (
    <div
        className={cx(
            "flex flex-col items-center justify-center",
            hasBorderLeft && "border-l border-secondary pl-3"
        )}
    >
        <div className={cx("flex items-center gap-1 font-bold text-md", valueClassName)}>
            {Icon && <Icon className={iconClassName} />}
            <span>{value}</span>
        </div>
        <span className="text-xs font-medium text-tertiary mt-0.5">{label}</span>
    </div>
);

// ─── Reusable Stats Grid Sub-Component ───────────────────────────────────────
interface StatGridProps {
    user: LeaderboardUser;
}

const StatGrid = ({ user }: StatGridProps) => {
    const isSubscriptionMode = user.totalSpend !== undefined;

    if (isSubscriptionMode) {
        return (
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-secondary bg-primary_alt p-3.5 text-center">
                <StatItem
                    value={`Rp${user.totalSpend?.toLocaleString("id-ID")}`}
                    label="Total Uang"
                    valueClassName="text-emerald-600 dark:text-emerald-400"
                />
                <StatItem
                    value={`${user.purchaseCount ?? 1}x`}
                    label="Jumlah Langganan"
                    // valueClassName="text-emerald-600 dark:text-emerald-400"
                    hasBorderLeft
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-secondary bg-primary_alt p-3.5 text-center">
            <StatItem
                value={user.points !== undefined ? user.points.toLocaleString("id-ID") : "0"}
                label="Total Poin"
                icon={Zap}
                iconClassName="size-4 text-warning-500 fill-warning-500"
                valueClassName="text-brand-600 dark:text-brand-400"
            />
            <StatItem
                value={user.examsCompleted !== undefined ? user.examsCompleted : 0}
                label="Ujian Selesai"
                icon={CheckCircle}
                iconClassName="size-4 text-emerald-500"
                valueClassName="text-emerald-600 dark:text-emerald-400"
                hasBorderLeft
            />
        </div>
    );
};

// ─── Main TopRankCard Component ───────────────────────────────────────────────
interface TopRankCardProps {
    user?: LeaderboardUser;
    loading?: boolean;
    className?: string;
}

export const TopRankCard = ({ user, loading = false, className }: TopRankCardProps) => {
    const router = useRouter();

    if (loading) {
        return (
            <div
                className={cx(
                    "flex h-full flex-col justify-between gap-6 rounded-2xl border border-secondary bg-primary p-6 shadow-sm animate-pulse",
                    className
                )}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="h-6 w-32 rounded-full bg-secondary" />
                    <div className="h-6 w-8 rounded-full bg-secondary" />
                </div>
                <div className="flex flex-col items-center gap-3 mt-2">
                    <div className="size-20 rounded-full bg-secondary" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-5 w-28 rounded bg-secondary" />
                        <div className="h-4 w-20 rounded-full bg-secondary" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-secondary bg-primary_alt p-3.5">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="h-5 w-14 rounded bg-secondary" />
                        <div className="h-3 w-16 rounded bg-secondary" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 border-l border-secondary pl-3">
                        <div className="h-5 w-14 rounded bg-secondary" />
                        <div className="h-3 w-16 rounded bg-secondary" />
                    </div>
                </div>
                <div className="h-10 w-full rounded-xl bg-secondary" />
                <div className="h-10 w-full rounded-xl bg-secondary" />
            </div>
        );
    }

    const rankUser: LeaderboardUser = user || {
        id: "default-1",
        rank: 1,
        name: "Pengguna Utama",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PenggunaUtama",
        points: 0,
        examsCompleted: 0,
        badgeLabel: "Free",
    };

    return (
        <div
            className={cx(
                "group relative flex h-fit flex-col justify-between gap-6 rounded-2xl border border-secondary bg-primary p-6 shadow-sm transition-all hover:shadow-md",
                className
            )}
        >
            {/* Top Header Row with Untitled UI Badges */}
            <div className="flex items-center justify-between gap-2">
                <BadgeWithIcon
                    type="pill-color"
                    color="warning"
                    size="md"
                    iconLeading={Trophy01}
                >
                    TOP LEADERBOARD
                </BadgeWithIcon>

                <Badge type="pill-color" color="warning" size="sm" className="font-bold">
                    #1
                </Badge>
            </div>

            {/* User Profile Header */}
            <div className="flex flex-col items-center text-center gap-3 mt-2">
                <div className="relative">
                    <img
                        src={rankUser.avatar}
                        alt={rankUser.name}
                        className="size-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-yellow-500 text-yellow-200 shadow-xs ring-2 ring-yellow-400">
                        <Award05 />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-lg font-semibold text-primary truncate max-w-[220px]">
                        {rankUser.name}
                    </h3>
                    {rankUser.badgeLabel && (
                        <PlanBadge label={rankUser.badgeLabel} size="sm" />
                    )}
                </div>
            </div>

            {/* Reusable Stats Highlight Grid Component */}
            <StatGrid user={rankUser} />

            {/* Motivation Quote */}
            <div className="rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 p-3 text-center">
                <p className="text-xs text-brand-700 dark:text-brand-300 italic font-medium">
                    &ldquo;Konsistensi latihan adalah kunci utama meraih skor tertinggi!&rdquo;
                </p>
            </div>

            {/* Action Button */}
            <Button
                size="md"
                color="primary"
                iconTrailing={ArrowRight}
                onClick={() => router.push("/playground")}
                className="w-full justify-center"
            >
                Kejar Peringkat #1
            </Button>
        </div>
    );
};

export default TopRankCard;
