"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Converts an array of points into a smooth cubic Bezier SVG path (Catmull-Rom spline).
 */
function createSmoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 4.5;
        const cp1y = p1.y + (p2.y - p0.y) / 4.5;
        const cp2x = p2.x - (p3.x - p1.x) / 4.5;
        const cp2y = p2.y - (p3.y - p1.y) / 4.5;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
}

export const PaperAirplaneScrollTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const maskPathRef = useRef<SVGPathElement>(null);
    const planeGroupRef = useRef<SVGGElement>(null);

    const [dimensions, setDimensions] = useState({ width: 1200, height: 3200 });
    const [pathD, setPathD] = useState("");
    const [totalLength, setTotalLength] = useState(0);

    const currentProgressRef = useRef(0);
    const targetProgressRef = useRef(0);

    // 1. Measure container dimensions and regenerate flight path
    useEffect(() => {
        const updateDimensions = () => {
            const pageHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight * 2
            );
            const pageWidth = window.innerWidth;

            setDimensions({ width: pageWidth, height: pageHeight });

            // Generate responsive flight waypoints along the outer margin (pinggir section)
            // to prevent the flight path and airplane from cutting through the center text/content
            const w = pageWidth;
            const h = pageHeight;
            const containerMaxW = 1280;
            const hasSideGutters = w > containerMaxW + 80;

            let gutterX: number;
            let swing: number;

            if (hasSideGutters) {
                // On wide desktop: Content ends at (w + containerMaxW) / 2.
                // Travel down within the generous right side gutter outside content
                const contentRight = (w + containerMaxW) / 2;
                gutterX = Math.min(w - 55, Math.max(contentRight + 35, (contentRight + w) / 2));
                swing = Math.min(38, (w - contentRight - 20) * 0.3);
            } else {
                // On mobile / tablet: Hug the outer right margin
                gutterX = Math.max(28, w - 28);
                swing = 8;
            }

            const waypoints = [
                { x: gutterX, y: 140 },
                { x: gutterX + swing * 0.7, y: Math.max(450, h * 0.12) },
                { x: gutterX - swing * 0.9, y: h * 0.24 },
                { x: gutterX + swing * 0.8, y: h * 0.38 },
                { x: gutterX - swing * 0.6, y: h * 0.52 },
                { x: gutterX + swing * 0.9, y: h * 0.66 },
                { x: gutterX - swing * 0.7, y: h * 0.80 },
                { x: gutterX + swing * 0.5, y: h * 0.92 },
                { x: gutterX, y: h * 0.98 },
            ];

            const d = createSmoothPath(waypoints);
            setPathD(d);
        };

        updateDimensions();

        // Observe height changes (e.g. accordion open/close, lazy images loading)
        const observer = new ResizeObserver(() => {
            updateDimensions();
        });
        if (document.body) {
            observer.observe(document.body);
        }

        window.addEventListener("resize", updateDimensions);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    // 2. Measure SVG path length when path changes
    useEffect(() => {
        if (!pathRef.current) return;
        try {
            const len = pathRef.current.getTotalLength();
            setTotalLength(len);
        } catch {
            // fallback
        }
    }, [pathD]);

    // 3. Scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const raw = window.scrollY / maxScroll;
            targetProgressRef.current = Math.min(1, Math.max(0, raw));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 4. Smooth animation loop with requestAnimationFrame
    useEffect(() => {
        let animId: number;

        const loop = (timestamp: number) => {
            // Spring/lerp towards target scroll progress for buttery smooth flight
            currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.085;

            const path = pathRef.current;
            const maskPath = maskPathRef.current;
            const plane = planeGroupRef.current;

            if (path && plane && totalLength > 0) {
                const curDist = Math.max(0, Math.min(totalLength, currentProgressRef.current * totalLength));

                // Position on path
                const pt = path.getPointAtLength(curDist);

                // Tangent orientation (point slightly ahead)
                const nextDist = Math.min(totalLength, curDist + 4);
                const nextPt = path.getPointAtLength(nextDist);

                let angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);

                // Subtle organic flying bank/wobble
                const wobble = Math.sin(timestamp * 0.0025) * 2;
                angle += wobble;
                const floatY = Math.cos(timestamp * 0.003) * 1.5;

                // Update plane transform
                plane.setAttribute(
                    "transform",
                    `translate(${pt.x.toFixed(2)}, ${(pt.y + floatY).toFixed(2)}) rotate(${angle.toFixed(2)})`
                );

                // Update mask stroke-dashoffset to reveal active trail up to plane
                if (maskPath) {
                    maskPath.style.strokeDashoffset = `${Math.max(0, totalLength - curDist)}`;
                }
            }

            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [totalLength]);

    if (!pathD) return null;

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none overflow-hidden"
            style={{ zIndex: 0 }}
        >
            <svg
                className="w-full h-full"
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Glowing trail gradient */}
                    <linearGradient id="plane-trail-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#fb923c" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Radial aura around airplane */}
                    <radialGradient id="plane-aura" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                        <stop offset="60%" stopColor="#fb923c" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </radialGradient>

                    {/* Reveal mask for the illuminated dashed trail */}
                    <mask
                        id="plane-trail-reveal-mask"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={dimensions.width}
                        height={dimensions.height}
                    >
                        <path
                            ref={maskPathRef}
                            d={pathD}
                            fill="none"
                            stroke="white"
                            strokeWidth="24"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: `${totalLength}`,
                                strokeDashoffset: `${totalLength}`,
                            }}
                        />
                    </mask>

                    {/* Glow filter for active trail */}
                    <filter id="trail-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* 1. Underlying subtle flight track (faint dashed path) */}
                <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    className="text-brand-500/15 dark:text-brand-400/20"
                />

                {/* 2. Active illuminated flight trail (revealed up to plane location) */}
                <g mask="url(#plane-trail-reveal-mask)">
                    {/* Soft glowing contrail backing */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="3.5"
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                        filter="url(#trail-glow)"
                    />
                    {/* Vibrant dashed contrail */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="url(#plane-trail-grad)"
                        strokeWidth="2.2"
                        strokeDasharray="5 7"
                        strokeLinecap="round"
                        strokeOpacity="0.85"
                    />
                </g>

                {/* 3. Paper Airplane Vector */}
                <g ref={planeGroupRef} className="transition-transform duration-75">
                    {/* Soft atmospheric aura */}
                    <circle cx="0" cy="0" r="32" fill="url(#plane-aura)" />

                    {/* Origami Paper Airplane geometry */}
                    <g transform="translate(-18, -6) scale(1.15)">
                        {/* Upper wing fold */}
                        <path
                            d="M40 0 0 -14l9 14Z"
                            fill="#fb923c"
                            className="transition-colors"
                        />
                        {/* Main fuselage / body */}
                        <path
                            d="M40 0H9l-5 13Z"
                            fill="#f97316"
                            className="transition-colors"
                        />
                        {/* Underfold shadow */}
                        <path
                            d="m9 0-5 13 10-9Z"
                            fill="#c2410c"
                            className="transition-colors"
                        />
                        {/* Highlight center crease */}
                        <line
                            x1="9"
                            y1="0"
                            x2="40"
                            y2="0"
                            stroke="#fff"
                            strokeWidth="0.75"
                            strokeOpacity="0.6"
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};
