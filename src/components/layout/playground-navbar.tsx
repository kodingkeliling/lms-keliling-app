"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/foundations/theme-toggle";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/base/buttons/button";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";

export const PlaygroundNavbar = () => {
    const { isAuthenticated, isAuthReady } = useAuthStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const hasSessionCookie = isMounted
        ? document.cookie.split(";").some((c) => c.trim().startsWith("has_session="))
        : true;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary bg-primary/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-3 md:px-8">
                {/* Logo */}
                <LogoWithTitle href="/playground" size="md" />

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {!isMounted || (!hasSessionCookie && !isAuthReady) ? (
                        !isMounted ? (
                            <div className="h-9 w-24 animate-pulse rounded-lg bg-secondary" />
                        ) : (
                            <Button
                                size="sm"
                                color="secondary"
                                onClick={() => router.push("/login?redirect=/playground")}
                            >
                                Masuk
                            </Button>
                        )
                    ) : !isAuthReady ? (
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-secondary" />
                    ) : isAuthenticated ? (
                        <UserDropdown />
                    ) : (
                        <Button
                            size="sm"
                            color="secondary"
                            onClick={() => router.push("/login?redirect=/playground")}
                        >
                            Masuk
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
