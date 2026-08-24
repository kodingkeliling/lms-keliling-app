"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu01, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ThemeToggle } from "@/components/foundations/theme-toggle";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";
import { MCPGuideModal } from "@/components/layout/mcp-guide-modal";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { AuthButtons } from "@/components/shared-assets/auth-buttons";

const NAV_ITEMS = [
    { label: "Beranda", href: "/" },
    { label: "Harga", href: "/pricing" },
    { label: "Papan Peringkat", href: "/leaderboard" },
    { label: "Pertanyaan", href: "/faq" },
    { label: "Hubungi", href: "/contact" },
];

export const Navbar = () => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mcpModalOpen, setMcpModalOpen] = useState(false);

    const { isAuthenticated, isAuthReady } = useAuthStore();

    return (
        <>
            <header className="relative z-50 w-full animate-[fadeSlideDown_0.6s_ease-out_both]">
                <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-5 md:px-8">
                    {/* Logo + Desktop nav */}
                    <div className="flex items-center gap-6">
                        <LogoWithTitle href="/" size="lg" />

                        <nav className="hidden md:flex items-center gap-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cx(
                                            "px-3 py-2 text-sm font-medium transition-colors",
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

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* Wait until auth check is done to avoid flash */}
                        {!isAuthReady ? (
                            <div className="h-9 w-24 animate-pulse rounded-lg bg-secondary" />
                        ) : isAuthenticated ? (
                            <UserDropdown />
                        ) : (
                            <AuthButtons size="sm" className="hidden sm:flex" />
                        )}

                        {/* Mobile hamburger */}
                        <Button
                            size="sm"
                            color="tertiary"
                            className="flex md:hidden"
                            iconLeading={mobileOpen ? X : Menu01}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        />
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-secondary bg-primary px-4 py-4 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
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
                        {!isAuthReady ? null : !isAuthenticated && (
                            <AuthButtons size="sm" className="pt-2 border-t border-secondary mt-2 flex-1" />
                        )}
                    </div>
                )}
            </header>

            <MCPGuideModal isOpen={mcpModalOpen} onClose={() => setMcpModalOpen(false)} />
        </>
    );
};
