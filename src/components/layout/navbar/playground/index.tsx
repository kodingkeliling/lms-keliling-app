"use client";

import { ThemeToggle } from "@/components/foundations/theme-toggle";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";
import { NavbarAuthSlot } from "@/components/layout/navbar/navbar-auth-slot";
import { useActiveExam } from "@/store/use-exam-store";

export const PlaygroundNavbar = () => {
    // Hide auth buttons when user is actively taking an exam (ongoing status).
    // Still show UserDropdown so they know which account they're using.
    const activeExam = useActiveExam();
    const isExamOngoing = activeExam?.status === "ongoing";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary bg-primary/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-3 md:px-8">
                <LogoWithTitle href="/playground" size="md" />

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <NavbarAuthSlot
                        size="sm"
                        hideAuthButtons={isExamOngoing}
                        authButtonsClassName="flex"
                    />
                </div>
            </div>
        </header>
    );
};
