"use client";

export const HeroVectorTexture = () => {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
        >
            {/* 1. Ambient radial gradient focal point behind hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[680px] rounded-full bg-gradient-to-tr from-brand-500/15 via-amber-500/10 to-transparent blur-[120px] dark:from-brand-500/20 dark:via-amber-500/15" />

            {/* 2. Concentric animated ripple rings */}
            <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-40 dark:opacity-50"
                viewBox="0 0 850 850"
                fill="none"
            >
                <circle
                    cx="425"
                    cy="425"
                    r="220"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    className="text-brand-500/30 dark:text-brand-400/40 animate-[spin_120s_linear_infinite]"
                    style={{ transformOrigin: "425px 425px" }}
                />
                <circle
                    cx="425"
                    cy="425"
                    r="320"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="6 12"
                    className="text-brand-500/20 dark:text-brand-400/30 animate-[spin_160s_linear_infinite_reverse]"
                    style={{ transformOrigin: "425px 425px" }}
                />
                <circle
                    cx="425"
                    cy="425"
                    r="400"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="3 14"
                    className="text-brand-500/15 dark:text-brand-400/20"
                />
            </svg>

            {/* 3. Left Constellation Network (Knowledge Graph) */}
            <svg
                className="hidden md:block absolute -left-12 top-16 w-80 h-96 opacity-60 dark:opacity-75"
                viewBox="0 0 320 380"
                fill="none"
            >
                <polyline
                    points="30,80 120,40 210,110 160,220 70,180 30,80 160,220 250,290 190,360"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="3 5"
                    className="text-brand-500/30 dark:text-brand-400/40"
                />
                {[
                    { cx: 30, cy: 80, delay: "0s" },
                    { cx: 120, cy: 40, delay: "1s" },
                    { cx: 210, cy: 110, delay: "2s" },
                    { cx: 160, cy: 220, delay: "1.5s" },
                    { cx: 70, cy: 180, delay: "0.5s" },
                    { cx: 250, cy: 290, delay: "2.5s" },
                    { cx: 190, cy: 360, delay: "3s" },
                ].map((node, i) => (
                    <g key={i} className="animate-pulse" style={{ animationDelay: node.delay }}>
                        <circle cx={node.cx} cy={node.cy} r="8" fill="#f97316" fillOpacity="0.15" />
                        <circle cx={node.cx} cy={node.cy} r="3" fill="#f97316" className="dark:fill-brand-400" />
                    </g>
                ))}
            </svg>

            {/* 4. Right Constellation Network */}
            <svg
                className="hidden lg:block absolute -right-16 top-10 w-96 h-96 opacity-60 dark:opacity-75"
                viewBox="0 0 380 380"
                fill="none"
            >
                <polyline
                    points="320,60 220,110 160,40 80,130 140,240 260,210 320,60 140,240 200,340 310,310"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="3 5"
                    className="text-brand-500/30 dark:text-brand-400/40"
                />
                {[
                    { cx: 320, cy: 60, delay: "0.8s" },
                    { cx: 220, cy: 110, delay: "1.8s" },
                    { cx: 160, cy: 40, delay: "2.3s" },
                    { cx: 80, cy: 130, delay: "1.2s" },
                    { cx: 140, cy: 240, delay: "0.3s" },
                    { cx: 260, cy: 210, delay: "2.7s" },
                    { cx: 200, cy: 340, delay: "1.6s" },
                    { cx: 310, cy: 310, delay: "0.9s" },
                ].map((node, i) => (
                    <g key={i} className="animate-pulse" style={{ animationDelay: node.delay }}>
                        <circle cx={node.cx} cy={node.cy} r="8" fill="#f97316" fillOpacity="0.15" />
                        <circle cx={node.cx} cy={node.cy} r="3" fill="#f97316" className="dark:fill-brand-400" />
                    </g>
                ))}
            </svg>

            {/* 5. Geometric Floating Markers */}
            <div className="absolute top-12 left-1/4 animate-[float_6s_ease-in-out_infinite] opacity-50 dark:opacity-70 text-brand-500">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>

            <div className="absolute bottom-16 right-1/4 animate-[float_7s_ease-in-out_1.5s_infinite] opacity-50 dark:opacity-70 text-amber-500">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="9" y="1" width="10" height="10" transform="rotate(45 9 1)" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>

            <div className="absolute top-28 right-16 animate-[float_5.5s_ease-in-out_2s_infinite] opacity-40 dark:opacity-60 text-brand-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
};

export const PageVectorTexture = () => {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none select-none overflow-hidden"
            style={{ zIndex: -1 }}
        >
            {/* 1. Ambient atmospheric glow orbs */}
            <div className="absolute -top-[15%] -left-[10%] size-[60%] rounded-full bg-brand-500/12 blur-[150px] animate-[pulse_9s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] -right-[15%] size-[50%] rounded-full bg-amber-500/10 blur-[160px] animate-[pulse_11s_ease-in-out_2s_infinite]" />
            <div className="absolute -bottom-[15%] -left-[10%] size-[55%] rounded-full bg-brand-500/10 blur-[150px] animate-[pulse_10s_ease-in-out_4s_infinite]" />

            {/* 2. Precision tech grid texture with brand orange accents */}
            <div
                className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(249, 115, 22, 0.4) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(249, 115, 22, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, #000 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, #000 40%, transparent 100%)",
                }}
            />

            {/* 3. Floating vector tech symbols (Crosses, dots, rings) */}
            <div
                className="absolute top-[18%] left-[7%] animate-[float_8s_ease-in-out_infinite] opacity-35 dark:opacity-50 text-brand-500"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2V16M2 9H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </div>

            <div
                className="absolute top-[28%] right-[8%] animate-[float_9s_ease-in-out_1.8s_infinite] opacity-30 dark:opacity-45 text-amber-500"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
            </div>

            <div
                className="absolute top-[52%] left-[4%] animate-[float_10s_ease-in-out_3s_infinite] opacity-30 dark:opacity-45 text-brand-400"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="10" y="2" width="11" height="11" transform="rotate(45 10 2)" stroke="currentColor" strokeWidth="1.4" />
                </svg>
            </div>

            <div
                className="absolute top-[68%] right-[6%] animate-[float_8.5s_ease-in-out_1.2s_infinite] opacity-35 dark:opacity-50 text-brand-500"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            </div>

            <div
                className="absolute top-[85%] left-[8%] animate-[float_9.5s_ease-in-out_4s_infinite] opacity-30 dark:opacity-45 text-amber-500"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L11 7L17 9L11 11L9 17L7 11L1 9L7 7L9 1Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
};
