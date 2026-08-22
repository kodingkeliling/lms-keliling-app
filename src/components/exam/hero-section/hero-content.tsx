"use client";

import { BookOpen01, Zap, PlayCircle, CheckVerified01 } from "@untitledui/icons";
import { FeaturedIcon } from "../../foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";

export const HeroContent = () => {
    return (
        <div className="flex max-w-xl flex-col gap-6 text-center lg:sticky lg:top-4 lg:self-start lg:text-left">
            <div className="flex justify-center lg:justify-start">
                <FeaturedIcon icon={Zap} color="brand" theme="light" size="lg" />
            </div>

            <div className="flex flex-col gap-4">
                <h1 className="text-display-md font-semibold text-primary lg:text-display-md">
                    Temukan cara baru belajar bahasa menggunakan MCP. ⭐
                </h1>
                <p className="text-lg text-tertiary lg:text-lg">
                    <strong>LMS Keliling (Language Management System)</strong> Buat soal ujian lebih gampang. Latih Reading, Writing, Speaking, dan Listening dalam 14+ bahasa dengan soal yang selalu unik. Dan hasil penilaian langsung muncul tanpa harus menunggu.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <div className="flex items-center gap-2 rounded-full border border-secondary bg-primary px-3 py-1 text-sm font-medium text-secondary">
                    <BookOpen01 className="size-4" />
                    <span>Belajar lebih cepat</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-secondary bg-primary px-3 py-1 text-sm font-medium text-secondary">
                    <Zap className="size-4" />
                    <span>Dibuat oleh AI</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-secondary bg-primary px-3 py-1 text-sm font-medium text-secondary">
                    <CheckVerified01 className="size-4" />
                    <span>Gratis Percobaan</span>
                </div>
            </div>

            {/* <div className="flex flex-col gap-3 sm:flex-row items-center justify-center lg:justify-start">
                <Button
                    className="w-fit px-12 lg:hidden"
                    iconLeading={PlayCircle}
                    onClick={() => document.getElementById("setup-exam")?.scrollIntoView({ behavior: "smooth" })}
                >
                    Mulai Sekarang
                </Button>
            </div> */}
        </div>
    );
};
