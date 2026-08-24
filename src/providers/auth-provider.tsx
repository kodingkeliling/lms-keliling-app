"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AvatarPickerGate } from "@/components/profile/avatar-picker-gate";
import { COOKIE_NAME } from "@/lib/auth-cookie";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { logout, setUser, setAuthReady } = useAuthStore();

    useEffect(() => {
        // If the auth cookie doesn't exist at all, we know for sure the user
        // is not logged in — skip the network round-trip and mark ready immediately.
        const hasCookie = document.cookie
            .split(";")
            .some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));

        if (!hasCookie) {
            logout();
            setAuthReady();
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    // Token rejected by server — clear the cookie so middleware
                    // stops treating the user as authenticated.
                    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
                    logout();
                }
            } catch {
                logout();
            } finally {
                // Mark auth check as done — UI can now render auth-sensitive content
                setAuthReady();
            }
        };

        checkAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {children}
            <AvatarPickerGate />
        </>
    );
}
