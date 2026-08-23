import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { LeaderboardSection } from "@/components/marketing/leaderboard-section";

export const metadata: Metadata = {
    title: "Papan Peringkat (Leaderboard) - LMS Keliling",
    description: "Lihat peringkat pengguna teratas berdasarkan perolehan poin ujian dan total langganan di LMS Keliling.",
};

export default function LeaderboardPage() {
    return (
        <PageLayout>
            <div className="w-full animate-[fadeSlideUp_0.7s_ease-out_0.1s_both]">
                <LeaderboardSection />
            </div>
        </PageLayout>
    );
}
