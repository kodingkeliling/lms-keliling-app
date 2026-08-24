"use client";

import { Leaderboard } from "@/components/leaderboard";
import { TokenStatusCard } from "@/components/playground/token-status-card";

interface LeaderboardSidebarProps {
    /** Show the TokenStatusCard above the leaderboard (used in playground home). */
    showTokenCard?: boolean;
    /** Custom leaderboard title. */
    title?: string;
    /** Custom leaderboard description. */
    description?: string;
    /** Extra className on the wrapper aside element. */
    className?: string;
    /**
     * Tailwind classes for the sticky inner wrapper.
     * Defaults to `md:sticky md:top-[72px]` which suits the md:flex-row playground layout.
     * Pass `lg:sticky lg:top-[72px]` for pages that only go two-column at lg.
     */
    stickyClassName?: string;
}

/**
 * Reusable sticky sidebar containing an optional TokenStatusCard and Leaderboard.
 * Used in PlaygroundHome and ResultScreen.
 *
 * On mobile it renders inline (full-width, no sticky).
 * On the breakpoint where the layout goes two-column it becomes a sticky aside.
 */
export const LeaderboardSidebar = ({
    showTokenCard = false,
    title = "Papan Peringkat (Leaderboard)",
    description = "Peringkat pengguna terbaik berdasarkan perolehan poin dan riwayat berlangganan terbanyak.",
    className = "order-first md:order-last w-full md:w-[420px] lg:w-[460px] shrink-0",
    stickyClassName = "md:sticky md:-top-10",
}: LeaderboardSidebarProps) => (
    <aside className={`self-stretch ${className}`}>
        <div className={`flex flex-col gap-4 ${stickyClassName}`}>
            {showTokenCard && <TokenStatusCard />}
            <Leaderboard title={title} description={description} />
        </div>
    </aside>
);
