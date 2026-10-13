"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu01, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ThemeToggle } from "@/components/foundations/theme-toggle";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";
import { MCPGuideModal } from "@/components/layout/mcp-guide-modal";
import { NavbarAuthSlot } from "@/components/layout/navbar/navbar-auth-slot";
import { AuthButtons } from "@/components/shared-assets/auth-buttons";
import { APP_NAME } from "@/config";

const NAV_ITEMS = [
    { label: "Beranda", href: "/" },
    { label: "Harga", href: "/pricing" },
    { label: "Papan Peringkat", href: "/leaderboard" },
    { label: "Pertanyaan", href: "/faq" },
    { label: "Hubungi", href: "/contact" },
];

/** px scrolled before transition completes */
const THRESHOLD = 200;
/** Fixed navbar height in px */
const NAVBAR_H = 64;
/** Hero logo icon size (px) at scroll=0 — desktop */
const HERO_ICON = 80;
/** Hero logo icon size (px) at scroll=0 — mobile/tablet */
const HERO_ICON_MOBILE = 48;
/** Hero logo title image width (px) at scroll=0 — desktop */
const HERO_TITLE_W = 128;
/** Hero logo title image width (px) at scroll=0 — mobile */
const HERO_TITLE_W_MOBILE = 110;
/** Navbar logo icon size (px) */
const NAV_ICON = 32;
/** Navbar logo title width (px) */
const NAV_TITLE_W = 68;

/** Ease-out quadratic */
const easeOut = (x: number) => 1 - Math.pow(1 - x, 2);
/** Linear interpolate */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Navbar = () => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mcpModalOpen, setMcpModalOpen] = useState(false);
    const { isAuthenticated, isAuthReady } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Guards inline-style rendering — inline style.display always beats Tailwind classes,
    // so we use JS state to conditionally render rather than className="hidden lg:flex".
    const [isDesktop, setIsDesktop] = useState(false);

    // Measure actual left edge of container so desktop hero logo aligns exactly
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerLeft, setContainerLeft] = useState(32);

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const measure = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setContainerLeft(rect.left + 32);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const isHome = pathname === "/";

    const raw = Math.min(1, scrollY / THRESHOLD);
    const t = easeOut(raw);

    // ── Hero logo values ──
    const heroIconSize       = lerp(HERO_ICON, 0, t);
    const heroIconSizeMobile = lerp(HERO_ICON_MOBILE, 0, t);
    const heroTitleW         = lerp(HERO_TITLE_W, 0, t);
    const heroTitleWMobile   = lerp(HERO_TITLE_W_MOBILE, 0, t);
    const heroOpacity        = Math.max(0, 1 - raw * 1.6);
    // Drifts slightly upward as it disappears ("flying into navbar" feel)
    const heroTop            = lerp(NAVBAR_H + 20, NAVBAR_H - 10, t);
    const heroTopMobile      = lerp(NAVBAR_H + 12, NAVBAR_H - 8, t);

    // ── Navbar logo values (animated on home page; always visible on other pages) ──
    const navLogoOpacity = isHome ? Math.max(0, (raw - 0.3) / 0.7) : 1;
    const navLogoMaxW    = isHome ? navLogoOpacity * (NAV_ICON + NAV_TITLE_W + 24) : NAV_ICON + NAV_TITLE_W + 24;

    // ── Navbar glass background ──
    const bgOpacity     = isHome ? raw * 0.9 : 0.9;
    const blurPx        = isHome ? raw * 20 : 20;
    const borderOpacity = isHome ? raw * 0.08 : 0.08;

    return (
        <>
            {/* ─────────────────────────────────────────────────
                HERO LOGO — DESKTOP (fixed, left-aligned)
                Morphs away on scroll on home page only.
            ───────────────────────────────────────────────── */}
            {isMounted && isDesktop && isHome && (
                <div
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: `${heroTop}px`,
                        left: `${containerLeft}px`,
                        zIndex: 48,
                        opacity: heroOpacity,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        pointerEvents: "none",
                        willChange: "opacity, top",
                        transformOrigin: "left center",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt=""
                        width={HERO_ICON}
                        height={HERO_ICON}
                        priority
                        className="object-contain shrink-0"
                        style={{ width: `${heroIconSize}px`, height: `${heroIconSize}px`, willChange: "width, height" }}
                    />
                    <Image
                        src="/title-dark.png"
                        alt=""
                        width={HERO_TITLE_W}
                        height={Math.round(HERO_TITLE_W * 0.4)}
                        className="object-contain shrink-0 dark:hidden"
                        style={{ width: `${heroTitleW}px`, height: `${heroTitleW * 0.4}px`, willChange: "width, height" }}
                    />
                    <Image
                        src="/title-light.png"
                        alt=""
                        width={HERO_TITLE_W}
                        height={Math.round(HERO_TITLE_W * 0.4)}
                        className="object-contain shrink-0 hidden dark:block"
                        style={{ width: `${heroTitleW}px`, height: `${heroTitleW * 0.4}px`, willChange: "width, height" }}
                    />
                </div>
            )}

            {/* ─────────────────────────────────────────────────
                HERO LOGO — MOBILE/TABLET (fixed, centered)
                Centered right above "Temukan cara baru belajar
                bahasa menggunakan MCP." at scroll=0 on home
                page only.
            ───────────────────────────────────────────────── */}
            {isMounted && !isDesktop && isHome && (
                <div
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: `${heroTopMobile}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 48,
                        opacity: heroOpacity,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "8px",
                        pointerEvents: "none",
                        willChange: "opacity, top",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt=""
                        width={HERO_ICON_MOBILE}
                        height={HERO_ICON_MOBILE}
                        priority
                        className="object-contain shrink-0"
                        style={{ width: `${heroIconSizeMobile}px`, height: `${heroIconSizeMobile}px`, willChange: "width, height" }}
                    />
                    <Image
                        src="/title-dark.png"
                        alt=""
                        width={HERO_TITLE_W_MOBILE}
                        height={Math.round(HERO_TITLE_W_MOBILE * 0.4)}
                        className="object-contain shrink-0 dark:hidden"
                        style={{ width: `${heroTitleWMobile}px`, height: `${heroTitleWMobile * 0.4}px`, willChange: "width, height" }}
                    />
                    <Image
                        src="/title-light.png"
                        alt=""
                        width={HERO_TITLE_W_MOBILE}
                        height={Math.round(HERO_TITLE_W_MOBILE * 0.4)}
                        className="object-contain shrink-0 hidden dark:block"
                        style={{ width: `${heroTitleWMobile}px`, height: `${heroTitleWMobile * 0.4}px`, willChange: "width, height" }}
                    />
                </div>
            )}

            {/* ─────────────────────────────────────────────────
                FIXED NAVBAR
                - Mobile/Tablet: Animated logo slot (hidden at scroll=0, fades in on scroll) + ThemeToggle beside it on left.
                - Desktop: Animated logo + nav on left, ThemeToggle + login button on right.
            ───────────────────────────────────────────────── */}
            <header
                className="fixed top-0 left-0 right-0 z-50 w-full"
                style={{
                    backdropFilter: (!isHome || raw > 0.05) ? `blur(${blurPx}px)` : "none",
                    WebkitBackdropFilter: (!isHome || raw > 0.05) ? `blur(${blurPx}px)` : "none",
                    borderBottom: `1px solid rgba(0,0,0,${borderOpacity})`,
                }}
            >
                {/* Glass background */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-primary"
                    style={{ opacity: bgOpacity }}
                />

                <div
                    ref={containerRef}
                    className="mx-auto flex w-full max-w-container items-center justify-between px-4 md:px-8"
                    style={{ height: `${NAVBAR_H}px` }}
                >
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-2">
                        {/* Mobile/Tablet (< lg): Animated logo slot (hidden at scroll=0, fades in on scroll) + ThemeToggle beside it */}
                        <div className="flex lg:hidden items-center gap-2">
                            <div
                                style={{
                                    overflow: "hidden",
                                    maxWidth: `${navLogoMaxW}px`,
                                    opacity: navLogoOpacity,
                                    willChange: "max-width, opacity",
                                    flexShrink: 0,
                                }}
                            >
                                <Link
                                    href="/"
                                    className="flex items-center shrink-0"
                                    style={{ gap: "8px" }}
                                    tabIndex={navLogoOpacity < 0.05 ? -1 : 0}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt={`${APP_NAME} Logo`}
                                        width={NAV_ICON}
                                        height={NAV_ICON}
                                        priority
                                        className="object-contain shrink-0"
                                        style={{ width: `${NAV_ICON}px`, height: `${NAV_ICON}px` }}
                                    />
                                    <Image
                                        src="/title-dark.png"
                                        alt={APP_NAME}
                                        width={NAV_TITLE_W}
                                        height={Math.round(NAV_TITLE_W * 0.4)}
                                        priority
                                        className="object-contain shrink-0 dark:hidden"
                                        style={{ width: `${NAV_TITLE_W}px` }}
                                    />
                                    <Image
                                        src="/title-light.png"
                                        alt={APP_NAME}
                                        width={NAV_TITLE_W}
                                        height={Math.round(NAV_TITLE_W * 0.4)}
                                        priority
                                        className="object-contain shrink-0 hidden dark:block"
                                        style={{ width: `${NAV_TITLE_W}px` }}
                                    />
                                </Link>
                            </div>

                            <ThemeToggle />
                        </div>

                        {/* Desktop (>= lg): Animated logo slot — hidden at scroll=0, fades in on scroll */}
                        <div
                            className="hidden lg:block"
                            style={{
                                overflow: "hidden",
                                maxWidth: `${navLogoMaxW}px`,
                                opacity: navLogoOpacity,
                                willChange: "max-width, opacity",
                                flexShrink: 0,
                            }}
                        >
                            <Link
                                href="/"
                                className="flex items-center shrink-0 ml-1"
                                style={{ gap: "8px" }}
                                tabIndex={navLogoOpacity < 0.05 ? -1 : 0}
                            >
                                <Image
                                    src="/logo.png"
                                    alt={`${APP_NAME} Logo`}
                                    width={NAV_ICON}
                                    height={NAV_ICON}
                                    priority
                                    className="object-contain shrink-0"
                                    style={{ width: `${NAV_ICON}px`, height: `${NAV_ICON}px` }}
                                />
                                <Image
                                    src="/title-dark.png"
                                    alt={APP_NAME}
                                    width={NAV_TITLE_W}
                                    height={Math.round(NAV_TITLE_W * 0.4)}
                                    priority
                                    className="object-contain shrink-0 dark:hidden"
                                    style={{ width: `${NAV_TITLE_W}px` }}
                                />
                                <Image
                                    src="/title-light.png"
                                    alt={APP_NAME}
                                    width={NAV_TITLE_W}
                                    height={Math.round(NAV_TITLE_W * 0.4)}
                                    priority
                                    className="object-contain shrink-0 hidden dark:block"
                                    style={{ width: `${NAV_TITLE_W}px` }}
                                />
                            </Link>
                        </div>

                        {/* Desktop nav items */}
                        <nav className="hidden lg:flex items-center gap-1 ml-2">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cx(
                                            "px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                            isActive
                                                ? "text-brand-700 dark:text-brand-400"
                                                : "text-secondary hover:text-primary"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* RIGHT SECTION: Desktop ThemeToggle (always left of button masuk) + auth buttons + hamburger */}
                    <div className="flex items-center gap-3">
                        {/* Desktop ThemeToggle — always on the right side of navbar, to the left of button masuk */}
                        <div className="hidden lg:flex items-center">
                            <ThemeToggle />
                        </div>

                        <NavbarAuthSlot size="sm" authButtonsClassName="hidden sm:flex" />

                        {(!isMounted || !isAuthReady || !isAuthenticated) && (
                            <Button
                                size="sm"
                                color="tertiary"
                                className="flex lg:hidden"
                                iconLeading={mobileOpen ? X : Menu01}
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                            />
                        )}
                    </div>
                </div>

                {/* Mobile/tablet menu dropdown */}
                {mobileOpen && (!isMounted || !isAuthReady || !isAuthenticated) && (
                    <div className="lg:hidden border-t border-secondary bg-primary px-4 py-4 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cx(
                                        "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "text-brand-700 dark:text-brand-400"
                                            : "text-secondary hover:text-primary"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        {isMounted && isAuthReady && !isAuthenticated && (
                            <AuthButtons size="sm" className="pt-2 border-t border-secondary mt-2 flex-1" />
                        )}
                    </div>
                )}
            </header>

            {/*
                Spacer: navbar + hero logo offset on home page;
                standard navbar spacer (64px) on other pages.
            */}
            {isHome ? (
                <>
                    <div
                        aria-hidden
                        className="block lg:hidden"
                        style={{ height: `${NAVBAR_H + 12 + HERO_ICON_MOBILE + 14}px` }}
                    />
                    <div
                        aria-hidden
                        className="hidden lg:block"
                        style={{ height: `${NAVBAR_H + HERO_ICON + 44}px` }}
                    />
                </>
            ) : (
                <div
                    aria-hidden
                    style={{ height: `${NAVBAR_H}px` }}
                />
            )}

            <MCPGuideModal isOpen={mcpModalOpen} onClose={() => setMcpModalOpen(false)} />
        </>
    );
};
