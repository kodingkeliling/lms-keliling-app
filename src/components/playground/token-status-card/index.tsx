"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins01, Zap, LogIn01, UserPlus01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/base/buttons/button";

const FREE_LIMIT = 100;

interface TrialData {
    questionsUsed: number;
    limitReached: boolean;
}

// ── Guest CTA card ────────────────────────────────────────────────────────────
const GuestCard = () => {
    const router = useRouter();
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50/60 dark:border-brand-500/30 dark:bg-brand-500/5 p-4 shadow-xs">
            <div className="flex items-center gap-2">
                <UserPlus01 className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                    Simpan Progress Kamu
                </span>
            </div>
            <p className="text-[11px] text-tertiary leading-relaxed">
                Login atau daftar gratis untuk menyimpan hasil ujian, melacak perkembangan, dan mendapatkan kuota soal personal.
            </p>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
export const TokenStatusCard = () => {
    const router = useRouter();
    const { isAuthenticated, isAuthReady } = useAuthStore();
    const [trial, setTrial] = useState<TrialData | null>(null);

    useEffect(() => {
        if (!isAuthReady || !isAuthenticated) return;
        fetch("/api/trial")
            .then((r) => r.json())
            .then((d) => setTrial(d))
            .catch(() => {});
    }, [isAuthenticated, isAuthReady]);

    // Not yet ready — skeleton
    if (!isAuthReady) {
        return (
            <div className="flex w-full flex-col gap-3 rounded-xl border border-secondary p-4 shadow-xs animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded-md bg-secondary" />
                    <div className="h-4 w-12 rounded-md bg-secondary" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary" />
                <div className="h-3 w-36 rounded-md bg-secondary" />
            </div>
        );
    }

    // Guest — show CTA
    if (!isAuthenticated) return <GuestCard />;

    // Authenticated but quota not loaded yet — skeleton
    if (trial === null) {
        return (
            <div className="flex w-full flex-col gap-3 rounded-xl border border-secondary p-4 shadow-xs animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded-md bg-secondary" />
                    <div className="h-4 w-12 rounded-md bg-secondary" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary" />
                <div className="h-3 w-36 rounded-md bg-secondary" />
            </div>
        );
    }

    const used = trial.questionsUsed ?? 0;
    const remaining = Math.max(0, FREE_LIMIT - used);
    const percent = Math.min(100, Math.round((used / FREE_LIMIT) * 100));
    const isLow = remaining <= 3;
    const isEmpty = remaining === 0;

    return (
        <div className={cx(
            "flex w-full flex-col gap-3 rounded-xl border p-4 shadow-xs transition-all duration-300",
            isEmpty
                ? "border-red-200 bg-red-50/60 dark:border-red-500/30 dark:bg-red-500/5"
                : isLow
                    ? "border-yellow-200 bg-yellow-50/60 dark:border-yellow-500/30 dark:bg-yellow-500/5"
                    : "border-green-200 bg-green-50/60 dark:border-green-500/30 dark:bg-green-500/5"
        )}>
            {/* Title row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Coins01 className={cx(
                        "size-4",
                        isEmpty ? "text-red-600 dark:text-red-400"
                            : isLow ? "text-yellow-600 dark:text-yellow-400"
                                : "text-green-600 dark:text-green-400"
                    )} />
                    <span className={cx(
                        "text-sm font-semibold",
                        isEmpty ? "text-red-700 dark:text-red-300"
                            : isLow ? "text-yellow-700 dark:text-yellow-300"
                                : "text-green-700 dark:text-green-300"
                    )}>
                        Sisa Token
                    </span>
                </div>
                <span className={cx(
                    "text-xs font-bold",
                    isEmpty ? "text-red-600 dark:text-red-400"
                        : isLow ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                )}>
                    {`${remaining} / ${FREE_LIMIT}`}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                    className={cx(
                        "h-full rounded-full transition-all duration-500",
                        isEmpty ? "bg-red-500"
                            : isLow ? "bg-yellow-500"
                                : "bg-green-500"
                    )}
                    style={{ width: `${100 - percent}%` }}
                />
            </div>

            {/* Sub text + CTA */}
            <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-tertiary leading-tight">
                    {isEmpty
                        ? "Kuota habis — beli token untuk lanjut"
                        : isLow
                            ? `Segera habis — sisa ${remaining} soal gratis`
                            : `${remaining} soal gratis tersisa`}
                </p>
                {(isLow || isEmpty) && (
                    <button
                        onClick={() => router.push("/pricing")}
                        className="flex items-center gap-1 rounded-md bg-brand-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-brand-700 transition-colors shrink-0"
                    >
                        <Zap className="size-3" />
                        Beli Token
                    </button>
                )}
            </div>
        </div>
    );
};
