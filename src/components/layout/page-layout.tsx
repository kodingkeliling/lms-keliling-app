"use client";

import { useEffect } from "react";
import { Navbar } from "./navbar/main";
import { Footer } from "@/components/marketing/footer";
import { ScrollToTop } from "./scroll-to-top";
import { PageVectorTexture } from "@/components/marketing/background-texture";

function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        const elements = document.querySelectorAll(".reveal");
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
    useScrollReveal();

    return (
        <div className="flex min-h-dvh flex-col bg-primary relative">
            <PageVectorTexture />

            <Navbar />

            <main className="relative flex flex-1 flex-col">
                {children}
            </main>

            <Footer />
            <ScrollToTop />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50%      { transform: translateY(-12px) rotate(3deg); }
                }
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .reveal {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
                }
                .reveal.delay-1 { transition-delay: 80ms; }
                .reveal.delay-2 { transition-delay: 160ms; }
                .reveal.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};
