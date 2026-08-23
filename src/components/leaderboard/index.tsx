"use client";

import { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/application/tabs/tabs";
import { Badge } from "@/components/base/badges/badges";
import { PlanBadge } from "@/components/base/badges/plan-badge";
import { Trophy01, Zap, Award01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { useExamStore } from "@/store/use-exam-store";
import { useAuthStore } from "@/store/use-auth-store";
import { getAvatarUrl } from "@/data/avatars";

export interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    points?: number;
    examsCompleted?: number;
    totalSpend?: number;
    purchaseCount?: number;
    badgeLabel?: string;
    isCurrentUser?: boolean;
}

interface LeaderboardProps {
    className?: string;
    title?: string;
    description?: string;
    onRankOneChange?: (user: LeaderboardUser) => void;
    onLoadingChange?: (loading: boolean) => void;
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return (
        <div className="flex size-7 items-center justify-center rounded-full bg-warning-100 text-yellow-700 font-bold text-xs ring-2 ring-yellow-400 dark:bg-yellow-950/50 dark:text-yellow-300 shrink-0">
            <Award01 className="size-4 text-yellow-600 dark:text-yellow-400" /> 1
        </div>
    );
    if (rank === 2) return (
        <div className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold text-xs ring-2 ring-gray-300 dark:bg-gray-800 dark:text-gray-300 shrink-0">
            <Award01 className="size-4 text-gray-500 dark:text-gray-400" /> 2
        </div>
    );
    if (rank === 3) return (
        <div className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-xs ring-2 ring-amber-400 dark:bg-amber-950/50 dark:text-amber-300 shrink-0">
            <Award01 className="size-4 text-amber-700 dark:text-amber-400" /> 3
        </div>
    );
    return (
        <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-tertiary font-medium text-xs shrink-0">
            #{rank}
        </div>
    );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-secondary bg-primary_alt p-3.5 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="size-7 rounded-full bg-secondary shrink-0" />
                <div className="size-9 rounded-full bg-secondary shrink-0" />
                <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-28 rounded bg-secondary" />
                    <div className="h-3 w-16 rounded bg-secondary" />
                </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
                <div className="h-4 w-16 rounded bg-secondary" />
                <div className="h-3 w-12 rounded bg-secondary" />
            </div>
        </div>
    );
}

// ─── Leaderboard Row ──────────────────────────────────────────────────────────
interface LeaderboardRowProps {
    usr: LeaderboardUser;
    tab: "points" | "subscriptions";
    /** If true, renders a highlighted current-user card without the rank badge (uses text rank bubble) */
    isFloating?: boolean;
}

function LeaderboardRow({ usr, tab, isFloating = false }: LeaderboardRowProps) {
    const isPoints = tab === "points";
    const accentBorder = isPoints
        ? "border-brand-300 bg-brand-50/50 dark:bg-brand-950/20 dark:border-brand-800"
        : "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800";
    const badgeColor = isPoints ? "brand" : "success";
    const metricColor = isPoints
        ? "text-brand-600 dark:text-brand-400"
        : "text-emerald-600 dark:text-emerald-400";

    const rankBubble = isFloating ? (
        <div className={cx(
            "flex size-7 items-center justify-center rounded-full font-bold text-xs ring-1 shrink-0",
            isPoints
                ? "bg-brand-100 text-brand-700 ring-brand-300 dark:bg-brand-950 dark:text-brand-300"
                : "bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
        )}>
            #{usr.rank}
        </div>
    ) : (
        <RankBadge rank={usr.rank} />
    );

    const avatarRing = isFloating
        ? (isPoints ? "ring-brand-300" : "ring-emerald-300")
        : "ring-border-secondary";

    return (
        <div className={cx(
            "flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all",
            usr.isCurrentUser || isFloating
                ? accentBorder
                : "border-secondary bg-primary_alt hover:bg-primary_hover hover:shadow-xs"
        )}>
            {/* Left side */}
            <div className="flex items-center gap-3 min-w-0">
                {rankBubble}
                <img
                    src={usr.avatar}
                    alt={usr.name}
                    className={cx("size-9 rounded-full object-cover ring-1 shrink-0", avatarRing)}
                />
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-semibold text-primary truncate">{usr.name}</span>
                        {(usr.isCurrentUser || isFloating) && (
                            <Badge type="pill-color" color={badgeColor} size="sm" className="text-[10px] py-0 px-1.5 shrink-0">
                                Kamu
                            </Badge>
                        )}
                    </div>
                    <span className="text-xs text-tertiary">
                        {(usr.examsCompleted ?? 0)} Ujian Selesai
                    </span>
                </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end shrink-0">
                {isPoints ? (
                    <div className={cx("flex items-center gap-1 font-bold text-sm", metricColor)}>
                        <Zap className="size-4 text-warning-500 fill-warning-500" />
                        <span>{(usr.points ?? 0).toLocaleString("id-ID")} pts</span>
                    </div>
                ) : (
                    <div className={cx("flex items-center gap-1 font-bold text-sm", metricColor)}>
                        <span>Rp{(usr.totalSpend ?? 0).toLocaleString("id-ID")}</span>
                    </div>
                )}
                {usr.badgeLabel && (
                    <PlanBadge label={usr.badgeLabel} size="sm" className="mt-0.5 text-[10px]" />
                )}
            </div>
        </div>
    );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────
interface TabContentProps {
    loading: boolean;
    top5: LeaderboardUser[];
    currentUserEntry?: LeaderboardUser;
    showCurrentUser: boolean;
    tab: "points" | "subscriptions";
    emptyMessage: string;
}

function TabContent({ loading, top5, currentUserEntry, showCurrentUser, tab, emptyMessage }: TabContentProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-2.5">
                {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </div>
        );
    }

    if (top5.length === 0) {
        return <div className="py-8 text-center text-sm text-tertiary">{emptyMessage}</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-2.5">
                {top5.map((usr) => (
                    <LeaderboardRow key={usr.id} usr={usr} tab={tab} />
                ))}
            </div>

            {showCurrentUser && currentUserEntry && (
                <>
                    <div className="flex items-center justify-center my-1">
                        <span className="text-xs font-bold text-tertiary tracking-widest">• • •</span>
                    </div>
                    <LeaderboardRow usr={currentUserEntry} tab={tab} isFloating />
                </>
            )}
        </>
    );
}

// ─── Main Leaderboard Component ───────────────────────────────────────────────
export const Leaderboard = ({
    className,
    title = "Papan Peringkat (Leaderboard)",
    description = "Peringkat pengguna terbaik berdasarkan perolehan poin dan riwayat berlangganan terbanyak.",
    onRankOneChange,
    onLoadingChange,
}: LeaderboardProps) => {
    const [selectedTab, setSelectedTab] = useState<string>("points");
    const [pointsData, setPointsData] = useState<LeaderboardUser[]>([]);
    const [subscriptionsData, setSubscriptionsData] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const localExams = useExamStore((state) => state.exams);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        let isMounted = true;

        async function fetchLeaderboard() {
            try {
                const res = await fetch("/api/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.topPoints && data.topSubscriptions) {
                        let fetchedPoints: LeaderboardUser[] = data.topPoints;
                        let fetchedSubs: LeaderboardUser[] = data.topSubscriptions;

                        if (user) {
                            const completedLocal = localExams.filter((e) => e.status === "completed");
                            const displayName = user.name?.trim() || user.email.split("@")[0];
                            const planLabel =
                                user.planId === "ultimate-1000" ? "Luxury" :
                                    user.planId === "pro-500" ? "Eksklusif" :
                                        user.planId === "starter-100" ? "Premium" : "Free";

                            const matchFn = (u: LeaderboardUser) =>
                                u.id === user.id || u.name === displayName;

                            // — Points tab
                            const ptIdx = fetchedPoints.findIndex(matchFn);
                            if (ptIdx === -1) {
                                fetchedPoints.push({
                                    id: user.id, rank: 0, name: displayName,
                                    avatar: getAvatarUrl(user.avatarId),
                                    points: completedLocal.length * 100,
                                    examsCompleted: completedLocal.length,
                                    badgeLabel: planLabel, isCurrentUser: true,
                                });
                                fetchedPoints.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
                                fetchedPoints = fetchedPoints.map((u, i) => ({ ...u, rank: i + 1 }));
                            } else {
                                fetchedPoints[ptIdx].isCurrentUser = true;
                                fetchedPoints[ptIdx].avatar = getAvatarUrl(user.avatarId);
                                if (user.name?.trim()) fetchedPoints[ptIdx].name = user.name;
                            }

                            // — Subscriptions tab
                            const subIdx = fetchedSubs.findIndex(matchFn);
                            if (subIdx === -1) {
                                const totalSpend =
                                    user.planId === "ultimate-1000" ? 20000 :
                                        user.planId === "pro-500" ? 7500 :
                                            user.planId === "starter-100" ? 5000 : 0;
                                fetchedSubs.push({
                                    id: user.id, rank: 0, name: displayName,
                                    avatar: getAvatarUrl(user.avatarId),
                                    totalSpend,
                                    examsCompleted: completedLocal.length,
                                    badgeLabel: planLabel, isCurrentUser: true,
                                });
                                fetchedSubs.sort((a, b) => (b.totalSpend ?? 0) - (a.totalSpend ?? 0));
                                fetchedSubs = fetchedSubs.map((u, i) => ({ ...u, rank: i + 1 }));
                            } else {
                                fetchedSubs[subIdx].isCurrentUser = true;
                                fetchedSubs[subIdx].avatar = getAvatarUrl(user.avatarId);
                                if (user.name?.trim()) fetchedSubs[subIdx].name = user.name;
                            }
                        }

                        setPointsData(fetchedPoints);
                        setSubscriptionsData(fetchedSubs);
                    }
                }
            } catch (err) {
                console.error("Failed to load leaderboard API:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    onLoadingChange?.(false);
                }
            }
        }

        fetchLeaderboard();
        return () => { isMounted = false; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reactively update current user's avatar & name when user state changes in Zustand
    useEffect(() => {
        if (!user) return;
        const currentAvatar = getAvatarUrl(user.avatarId);
        const currentName = user.name?.trim() || user.email.split("@")[0];

        const updateItem = (item: LeaderboardUser) => {
            if (item.isCurrentUser || item.id === user.id || item.name === currentName) {
                return { ...item, avatar: currentAvatar, name: currentName, isCurrentUser: true };
            }
            return item;
        };

        setPointsData((prev) => prev.map(updateItem));
        setSubscriptionsData((prev) => prev.map(updateItem));
    }, [user]);

    // Notify parent of Rank 1 user when tab or data changes
    useEffect(() => {
        if (!onRankOneChange) return;
        const topUser = selectedTab === "points" ? pointsData[0] : subscriptionsData[0];
        if (topUser) onRankOneChange(topUser);
    }, [selectedTab, pointsData, subscriptionsData, onRankOneChange]);

    const matchUser = (u: LeaderboardUser) =>
        u.isCurrentUser || (user && (u.id === user.id || u.name === (user.name?.trim() || user.email.split("@")[0])));

    const top5Points = pointsData.slice(0, 5);
    const currentPt = pointsData.find(matchUser);

    const top5Subs = subscriptionsData.slice(0, 5);
    const currentSub = subscriptionsData.find(matchUser);

    const tabs = [
        { id: "points", label: "Point Tertinggi", icon: Trophy01 },
        { id: "subscriptions", label: "Langganan Terbanyak", icon: Award01 },
    ];

    return (
        <div className={cx("flex w-full flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6 shadow-sm", className)}>
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                        <Trophy01 className="size-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-primary">{title}</h2>
                </div>
                {description && <p className="text-sm text-tertiary mt-1">{description}</p>}
            </div>

            {/* Tabs */}
            <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)} className="w-full mt-2">
                <TabList type="button-minimal" className="w-full grid grid-cols-2" items={tabs}>
                    {tabs.map((tab) => (
                        <Tab key={tab.id} id={tab.id} className="w-full text-center justify-center py-2.5">
                            <tab.icon className="size-4 mr-1.5" />
                            <span>{tab.label}</span>
                        </Tab>
                    ))}
                </TabList>

                <TabPanel id="points" className="mt-4 flex flex-col gap-2.5">
                    <TabContent
                        loading={loading}
                        top5={top5Points}
                        currentUserEntry={currentPt}
                        showCurrentUser={!!(currentPt && currentPt.rank > 5)}
                        tab="points"
                        emptyMessage="Belum ada data pengerjaan ujian."
                    />
                </TabPanel>

                <TabPanel id="subscriptions" className="mt-4 flex flex-col gap-2.5">
                    <TabContent
                        loading={loading}
                        top5={top5Subs}
                        currentUserEntry={currentSub}
                        showCurrentUser={!!(currentSub && currentSub.rank > 5)}
                        tab="subscriptions"
                        emptyMessage="Belum ada data berlangganan."
                    />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default Leaderboard;
