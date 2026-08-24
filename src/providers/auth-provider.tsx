"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AvatarPickerGate } from "@/components/profile/avatar-picker-gate";

const AUTH_CHECK_TIMEOUT_MS = 8000; // 8s hard cap — skeleton never stuck forever

export function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        let settled = false;

        const settle = () => {
            if (settled) return;
            settled = true;
            useAuthStore.getState().setAuthReady();
        };

        // Hard timeout so skeleton never hangs if fetch stalls
        const timeout = setTimeout(() => {
            useAuthStore.getState().logout();
            settle();
        }, AUTH_CHECK_TIMEOUT_MS);

        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    useAuthStore.getState().setUser(data.user);
                } else {
                    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
                    useAuthStore.getState().logout();
                }
            } catch {
                useAuthStore.getState().logout();
            } finally {
                clearTimeout(timeout);
                settle();
            }
        };

        checkAuth();

        return () => clearTimeout(timeout);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {children}
            <AvatarPickerGate />
        </>
    );
}
