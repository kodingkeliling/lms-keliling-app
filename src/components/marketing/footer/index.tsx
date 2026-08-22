"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { useAuthStore } from "@/store/use-auth-store";
import { SOCIAL_LINKS } from "@/data/social-links";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";

const NAV_LINKS = [
    { label: "Beranda", href: "/" },
    { label: "Harga", href: "/pricing" },
    { label: "Pertanyaan", href: "/faq" },
    { label: "Hubungi", href: "/contact" },
];

export const Footer = () => {
    const year = new Date().getFullYear();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isAuthReady = useAuthStore((s) => s.isAuthReady);

    return (
        <footer className="w-full border-t border-secondary bg-primary">
            <div className="mx-auto w-full max-w-container px-4 py-12 md:px-8">
                {/* Top section */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    {/* Brand */}
                    <div className="flex max-w-xs flex-col gap-4">
                        <LogoWithTitle size="md" />
                        <p className="text-sm text-tertiary leading-relaxed">
                            LMS Keliling (Language Management System) — platform belajar bahasa dengan soal AI yang unik untuk Reading, Writing, Speaking, dan Listening dalam 14+ bahasa.
                        </p>
                    </div>

                    {/* CTA: hanya tampil kalau belum login */}
                    {isAuthReady && !isAuthenticated && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-secondary">Mulai sekarang, gratis</p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button size="md" color="secondary" href="/login">
                                    Masuk
                                </Button>
                                <Button size="md" href="/register">
                                    Daftar Gratis
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm text-tertiary hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Divider */}
                <hr className="my-8 border-secondary" />

                {/* Bottom row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-tertiary">
                        © {year} LMS Keliling oleh{" "}
                        <a
                            href="https://www.instagram.com/kodingkeliling/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                        >
                            Koding Keliling
                        </a>
                        . Semua hak dilindungi.
                    </p>

                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="text-tertiary transition-colors hover:text-primary"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
