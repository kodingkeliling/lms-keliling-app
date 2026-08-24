"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { AuthButtons } from "@/components/shared-assets/auth-buttons";

interface NavbarAuthSlotProps {
    /**
     * When true, only the UserDropdown (avatar) is shown for authenticated users.
     * No AuthButtons are shown for unauthenticated users.
     * Use this when the user is actively taking an exam.
     */
    hideAuthButtons?: boolean;
    /** Extra className on the AuthButtons wrapper */
    authButtonsClassName?: string;
    /** Button size passed to AuthButtons */
    size?: "sm" | "md" | "lg";
}

/**
 * Shared auth slot used by all navbar variants.
 * Handles the skeleton → unauthenticated → authenticated transition
 * with the has_session cookie fast-path to avoid unnecessary skeletons.
 */
export const NavbarAuthSlot = ({
    hideAuthButtons = false,
    authButtonsClassName = "hidden sm:flex",
    size = "sm",
}: NavbarAuthSlotProps) => {
    const { isAuthenticated, isAuthReady } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const hasSessionCookie = isMounted
        ? document.cookie.split(";").some((c) => c.trim().startsWith("has_session="))
        : true; // assume true on SSR to avoid flashing buttons

    // In exam mode skeleton looks like an avatar circle; otherwise a pill
    const skeleton = hideAuthButtons
        ? <div className="h-9 w-9 animate-pulse rounded-full bg-secondary" />
        : <div className="h-9 w-24 animate-pulse rounded-lg bg-secondary" />;

    // Not yet mounted (SSR) → skeleton
    if (!isMounted) return skeleton;

    // No session cookie → definitely not logged in, skip skeleton entirely
    if (!hasSessionCookie && !isAuthReady) {
        if (hideAuthButtons) return null;
        return <AuthButtons size={size} className={authButtonsClassName} />;
    }

    // Has session cookie but fetch not done yet → skeleton
    if (!isAuthReady) return skeleton;

    // Auth check done — render final state
    if (isAuthenticated) return <UserDropdown />;

    if (hideAuthButtons) return null;
    return <AuthButtons size={size} className={authButtonsClassName} />;
};
