"use client";

import { useEffect } from "react";
import { Navbar } from "./navbar/main";
import { Footer } from "@/components/marketing/footer";
import { ScrollToTop } from "./scroll-to-top";

const DOTS = [
    { top: "15%", left: "8%", size: 4, delay: "0s", duration: "6s" },
    { top: "25%", left: "88%", size: 3, delay: "1.5s", duration: "8s" },
    { top: "60%", left: "5%", size: 5, delay: "3s", duration: "7s" },
    { top: "70%", left: "92%", size: 3, delay: "0.8s", duration: "9s" },
    { top: "45%", left: "75%", size: 4, delay: "2s", duration: "6.5s" },
    { top: "80%", left: "30%", size: 3, delay: "4s", duration: "8s" },
];

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
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none select-none" style={{ zIndex: -1 }}>
                <div className="absolute -top-[20%] -left-[15%] size-[55%] rounded-full bg-brand-500/10 blur-[140px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute -bottom-[20%] -right-[15%] size-[55%] rounded-full bg-brand-400/10 blur-[140px] animate-[pulse_10s_ease-in-out_2s_infinite]" />
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.035]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(0,191,99,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,99,0.5) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {DOTS.map((dot, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-brand-400/30"
                        style={{
                            top: dot.top, left: dot.left,
                            width: dot.size, height: dot.size,
                            animationName: "float-dot",
                            animationDuration: dot.duration,
                            animationDelay: dot.delay,
                            animationTimingFunction: "ease-in-out",
                            animationIterationCount: "infinite",
                        }}
                    />
                ))}
            </div>

            <Navbar />

            <main className="relative flex flex-1 flex-col">
                {children}
            </main>

            <Footer />
            <ScrollToTop />

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-dot {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
                    50%       { transform: translateY(-18px) scale(1.3); opacity: 0.8; }
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
