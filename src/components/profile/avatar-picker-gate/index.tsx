"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AvatarPickerModal } from "@/components/profile/avatar-picker-modal";

export const AvatarPickerGate = () => {
    const { isAuthenticated, isAuthReady, user } = useAuthStore();
    const [dismissed, setDismissed] = useState(false);

    // Show modal if user is logged in, auth check completed, user has no avatarId set (newly registered user), and modal hasn't been dismissed in session
    const shouldShow = isAuthenticated && isAuthReady && Boolean(user) && (user?.avatarId === null || user?.avatarId === undefined) && !dismissed;

    if (!shouldShow) return null;

    return (
        <AvatarPickerModal
            isOpen={true}
            onClose={() => setDismissed(true)}
            onSaved={() => setDismissed(true)}
        />
    );
};
