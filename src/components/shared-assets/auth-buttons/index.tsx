"use client";

import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface AuthButtonsProps {
    /** Button size. Defaults to "sm". */
    size?: "sm" | "md" | "lg";
    /** Extra classes on the wrapper div. */
    className?: string;
}

/**
 * Reusable Masuk + Daftar Gratis button pair.
 * Used in Navbar (desktop & mobile) and Footer.
 */
export const AuthButtons = ({ size = "sm", className }: AuthButtonsProps) => (
    <div className={cx("flex gap-2", className)}>
        <Button size={size} color="secondary" href="/login">
            Masuk
        </Button>
        <Button size={size} href="/register">
            Daftar Gratis
        </Button>
    </div>
);
