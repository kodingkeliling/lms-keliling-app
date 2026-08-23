"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen01, Home01, LayoutAlt01, LogOut01, Settings01, Users01, Sun, Moon01, ChevronSelectorVertical, ArrowLeft, BookClosed, CreditCard01 } from "@untitledui/icons";
import { useTheme } from "next-themes";
import { NavList } from "@/components/application/app-navigation/base-components/nav-list";
import { FeaturedCardProgressBar } from "@/components/application/app-navigation/base-components/featured-cards";
import { MobileNavigationHeader } from "@/components/application/app-navigation/base-components/mobile-header";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { useAuthStore } from "@/store/use-auth-store";
import { APP_NAME, APP_LOGO } from "@/config";
import { cx } from "@/utils/cx";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { Button as AriaButton } from "react-aria-components";

function ThemeToggleDropdownItem() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Dropdown.Section>
                <Dropdown.Item id="dark-mode" icon={Moon01}>
                    Mode gelap
                </Dropdown.Item>
            </Dropdown.Section>
        );
    }

    const isDark = theme === "dark";

    return (
        <Dropdown.Section
            selectionMode="single"
            selectedKeys={isDark ? new Set(["dark-mode"]) : new Set([])}
            onSelectionChange={(keys) => {
                const arr = Array.from(keys);
                setTheme(arr.includes("dark-mode") ? "dark" : "light");
            }}
        >
            <Dropdown.Item id="dark-mode" icon={Moon01}>
                Mode gelap
            </Dropdown.Item>
        </Dropdown.Section>
    );
}

const SIDEBAR_WIDTH = 272;

// Menu untuk USER biasa — kelola soal & ujian sendiri
const USER_NAV_ITEMS: NavItemType[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home01 },
    { label: "Ujian", href: "/dashboard/exams", icon: BookClosed },
    { label: "Soal", href: "/dashboard/questions", icon: BookOpen01 },
];

const USER_FOOTER_ITEMS: NavItemType[] = [
    { label: "Playground", href: "/playground", icon: ArrowLeft },
];

// Menu untuk SUPER_ADMIN — manajemen user & langganan
const ADMIN_NAV_ITEMS: NavItemType[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home01 },
    { label: "Users", href: "/dashboard/users", icon: Users01 },
    { label: "Langganan", href: "/dashboard/subscriptions", icon: CreditCard01 },
];

const ADMIN_FOOTER_ITEMS: NavItemType[] = [
    { label: "Beranda", href: "/", icon: ArrowLeft },
];

function DashboardSidebar({ activeUrl }: { activeUrl: string }) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 1024);
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = isSuperAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
    const footerItems = isSuperAdmin ? ADMIN_FOOTER_ITEMS : USER_FOOTER_ITEMS;

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        logout();
        // Hard navigation — forces browser to send a new request so middleware
        // picks up the cleared cookie and redirects to /login properly.
        window.location.href = "/login";
    };

    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : "??";

    const sidebar = (
        <aside
            style={{ "--width": `${SIDEBAR_WIDTH}px` } as React.CSSProperties}
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-y-auto bg-primary",
                "border-r border-secondary lg:w-(--width) pt-4 lg:pt-6",
            )}
        >
            {/* Top: logo + nav */}
            <div className="flex flex-col gap-1">
                {/* Branding */}
                <div className="flex items-center gap-2.5 px-4 pb-2 lg:px-5">
                    <Image
                        src={APP_LOGO}
                        alt={`${APP_NAME} logo`}
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <span className="text-base font-bold text-primary tracking-tight">
                        {APP_NAME}
                    </span>
                </div>

                <NavList activeUrl={activeUrl} items={navItems} />
            </div>

            {/* Bottom: account dropdown */}
            <div className="flex flex-col gap-3 px-2 py-4 lg:px-4 lg:py-6 mt-auto">
                {!isSuperAdmin && (
                    <FeaturedCardProgressBar
                        title="Sisa Token"
                        description="Anda telah menggunakan 80% dari token gratis Anda. Beli tambahan?"
                        confirmLabel="Beli Token"
                        progress={80}
                        className="hidden md:flex mb-1"
                        onDismiss={() => { }}
                        onConfirm={() => {
                            router.push("/pricing");
                        }}
                    />
                )}
                {footerItems.length > 0 && (
                    <NavList activeUrl={activeUrl} items={footerItems} className="mt-0! px-0! mb-1" />
                )}

                {/* Divider */}
                <hr className="border-secondary" />

                {/* Account card / Dropdown */}
                <Dropdown.Root>
                    <AriaButton
                        className={({ isPressed, isFocusVisible }) =>
                            cx(
                                "relative w-full cursor-pointer rounded-lg bg-primary_alt p-2 text-left ring-1 ring-inset ring-border-secondary outline-hidden hover:bg-secondary transition-colors outline-offset-2 outline-focus-ring",
                                (isPressed || isFocusVisible) && "outline-2",
                            )
                        }
                    >
                        <AvatarLabelGroup
                            size="md"
                            initials={initials}
                            title={user?.name || user?.email || "—"}
                            subtitle={user?.role === "SUPER_ADMIN" ? "Administrator" : "User"}
                        />
                        <div className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md">
                            <ChevronSelectorVertical className="size-4 shrink-0 stroke-[2.25px] text-fg-quaternary" />
                        </div>
                    </AriaButton>
                    <Dropdown.Popover
                        placement={isMobile ? "top" : "right bottom"}
                        className={cx("w-[--trigger-width] min-w-[240px]", isMobile ? "mb-2" : "ml-4")}
                    >
                        <div className="flex flex-col border-b border-secondary px-4 py-3">
                            <p className="text-sm font-semibold text-primary truncate">{user?.name || user?.email || "—"}</p>
                            <p className="text-sm text-tertiary truncate">{user?.email}</p>
                        </div>
                        <Dropdown.Menu>
                            {!isSuperAdmin && (
                                <Dropdown.Item icon={Settings01} onAction={() => router.push("/dashboard/settings")}>
                                    Pengaturan
                                </Dropdown.Item>
                            )}
                            <ThemeToggleDropdownItem />
                            <Dropdown.Separator />
                            <Dropdown.Item icon={LogOut01} onAction={handleLogout}>
                                Keluar
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown.Root>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header wraps sidebar in a drawer */}
            <MobileNavigationHeader>{sidebar}</MobileNavigationHeader>

            {/* Desktop: fixed sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">
                {sidebar}
            </div>

            {/* Spacer so main content doesn't go under fixed sidebar */}
            <div
                style={{ paddingLeft: SIDEBAR_WIDTH }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname() ?? "";

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-secondary_subtle">
            <DashboardSidebar activeUrl={pathname} />

            <main className="flex flex-1 flex-col min-h-0">
                <div className="flex flex-1 flex-col gap-0 min-h-0 p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
