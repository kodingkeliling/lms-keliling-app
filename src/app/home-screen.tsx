"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { HeroSection } from "@/components/exam/hero-section";
import { PricingPlansSection } from "@/components/marketing/pricing-sections/pricing-plans-section";
import { LeaderboardSection } from "@/components/marketing/leaderboard-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { ContactSection } from "@/components/marketing/contact-section";

export const HomeScreen = () => {
    return (
        <PageLayout>
            <div className="w-full animate-[fadeSlideUp_0.7s_ease-out_0.2s_both]">
                <HeroSection />
            </div>

            <div id="harga" className="w-full reveal">
                <PricingPlansSection />
            </div>

            <div id="leaderboard" className="w-full reveal">
                <LeaderboardSection />
            </div>

            <div id="pertanyaan" className="w-full reveal delay-1">
                <FaqSection />
            </div>

            <div id="hubungi" className="w-full reveal delay-1">
                <ContactSection />
            </div>
        </PageLayout>
    );
};
