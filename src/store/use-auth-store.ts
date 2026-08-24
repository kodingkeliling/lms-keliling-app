import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "USER" | "SUPER_ADMIN";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    planId?: string | null;
    questionLimit?: number;
    avatarId?: string | null;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    /** True once the initial /api/auth/me check has completed. Use this to
     *  prevent UI flicker caused by rendering before auth state is confirmed. */
    isAuthReady: boolean;
    /** True once Zustand persist has rehydrated from localStorage. */
    isHydrated: boolean;
    setUser: (user: AuthUser) => void;
    logout: () => void;
    setAuthReady: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAuthReady: false,
            isHydrated: false,
            setUser: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            setAuthReady: () => set({ isAuthReady: true }),
        }),
        {
            name: "fraise-auth-storage",
            // Don't persist isAuthReady / isHydrated — they must always start false on mount
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) state.isHydrated = true;
            },
        }
    )
);
