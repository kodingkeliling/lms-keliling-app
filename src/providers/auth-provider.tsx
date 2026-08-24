"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AvatarPickerGate } from "@/components/profile/avatar-picker-gate";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { logout, setUser, setAuthReady } = useAuthStore();

    useEffect(() => {
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
