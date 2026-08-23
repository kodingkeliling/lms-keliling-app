"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/marketing/section-header";
import { Leaderboard, LeaderboardUser } from "@/components/leaderboard";
import { TopRankCard } from "@/components/leaderboard/top-rank-card";

export const LeaderboardSection = () => {
  const [topRankUser, setTopRankUser] = useState<LeaderboardUser | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto w-full max-w-container px-4 md:px-8">
        <SectionHeader
          title="Papan Peringkat"
          subtitle="Lihat peringkat pengguna teratas berdasarkan poin dan langganan."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: 1 Card Width (Profile Detail Juara 1) — Sticky on desktop */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <TopRankCard user={topRankUser} loading={loading} className="w-full" />
          </div>

          {/* Right: 2 Card Width (Leaderboard Component) */}
          <div className="lg:col-span-2">
            <Leaderboard
              onRankOneChange={setTopRankUser}
              onLoadingChange={setLoading}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
