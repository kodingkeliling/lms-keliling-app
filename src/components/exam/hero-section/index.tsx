"use client";

import { HeroContent } from "./hero-content";
import { HeroFormWrapper } from "./hero-form-wrapper";
import { HeroVectorTexture } from "@/components/marketing/background-texture";

export const HeroSection = () => {
    return (
        <section className="relative mx-auto flex w-full max-w-container flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-4 px-4 pt-2 pb-8">
            <HeroVectorTexture />
            <HeroContent />
            <HeroFormWrapper />
        </section>
    );
};
