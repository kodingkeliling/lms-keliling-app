"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button as AriaButton } from "react-aria-components";
import { useAuthStore } from "@/store/use-auth-store";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { ChevronDown, Play, HomeLine, LayoutGrid02, LogOut01, Settings01, Edit03 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { getAvatarUrl } from "@/data/avatars";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { APP_LOGO, APP_NAME } from "@/config";
import { useExamStore } from "@/store/use-exam-store";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { Button } from "@/components/base/buttons/button";
import { ThemeToggle } from "@/components/foundations/theme-toggle";

export function UserDropdown({ isToogleTheme = false }: { isToogleTheme?: boolean }) {
    const pathname = usePathname() ?? "";
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        useExamStore.getState().clearLocalExams();
        logout();
        window.location.href = "/";
    };

    const handleOpenEditModal = () => {
        setIsDropdownOpen(false);
        setIsEditModalOpen(true);
    };

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    // Determine dynamic menu item based on current route
    let dynamicItem: { label: string; href: string; icon: React.FC<{ className?: string }> } | null = null;
    if (!isSuperAdmin) {
        if (pathname.startsWith("/playground/") || pathname.startsWith("/result/")) {
            dynamicItem = { label: "Playground", href: "/playground", icon: Play };
        } else if (pathname === "/playground") {
            dynamicItem = { label: "Beranda", href: "/", icon: HomeLine };
        } else {
            dynamicItem = { label: "Playground", href: "/playground", icon: Play };
        }
    }

    return (
        <>
            <Dropdown.Root isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                {/* Trigger — must be AriaButton directly under AriaMenuTrigger */}
                <AriaButton
                    className={({ isPressed, isFocusVisible }) =>
                        cx(
                            "flex items-center gap-2.5 rounded-full border border-secondary px-3 py-1.5",
                            "bg-primary hover:bg-secondary transition-colors text-sm cursor-pointer outline-none",
                            (isPressed || isFocusVisible) && "bg-secondary"
                        )
                    }
                >
                    {/* Avatar circle */}
                    {user ? (
                        <img
                            src={getAvatarUrl(user.avatarId)}
                            alt={user.name || "User Avatar"}
                            className="size-7 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="size-7 shrink-0 rounded-full bg-secondary animate-pulse" />
                    )}
                    <Tooltip title={user?.name || user?.email || ""} placement="bottom">
                        <TooltipTrigger className="hidden sm:block max-w-[120px] truncate font-medium text-primary text-left">
                            {user ? (user.name || user.email) : <span className="inline-block h-3 w-20 rounded bg-secondary animate-pulse" />}
                        </TooltipTrigger>
                    </Tooltip>
                    {/* Chevron */}
                    <ChevronDown className="size-3 text-tertiary transition-transform duration-200 group-data-[open]:rotate-180" />
                </AriaButton>

                <Dropdown.Popover placement="bottom end" className="w-60">
                    <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                        <div className="flex flex-col min-w-0 pr-2">
                            <Tooltip title={user?.name || "User"} placement="bottom">
                                <TooltipTrigger className="text-sm font-semibold text-primary truncate max-w-full text-left">
                                    {user?.name || "User"}
                                </TooltipTrigger>
                            </Tooltip>
                            <Tooltip title={user?.email || ""} placement="bottom">
                                <TooltipTrigger className="text-xs text-tertiary truncate max-w-full text-left">
                                    {user?.email || <span className="inline-block h-3 w-32 rounded bg-secondary animate-pulse" />}
                                </TooltipTrigger>
                            </Tooltip>
                        </div>
                        {isToogleTheme ? (
                            <ThemeToggle size="xs"/>
                        ): (
                            <Button
                                type="button"
                                onClick={handleOpenEditModal}
                                title="Edit Profil"
                                iconLeading={Edit03}
                                size="xs"
                                color="secondary"
                            />
                            )
                        }
                    </div>
                    <Dropdown.Menu>
                        {dynamicItem && (
                            <Dropdown.Item icon={dynamicItem.icon} href={dynamicItem.href}>
                                {dynamicItem.label}
                            </Dropdown.Item>
                        )}
                        <Dropdown.Item icon={Settings01} href="/dashboard/settings">
                            Pengaturan Profil
                        </Dropdown.Item>
                        {isSuperAdmin && (
                            <Dropdown.Item icon={LayoutGrid02} href="/dashboard">
                                Dashboard
                            </Dropdown.Item>
                        )}

                        <Dropdown.Separator />

                        <Dropdown.Item icon={LogOut01} onAction={handleLogout}>
                            Keluar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown.Root>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
}
