"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { AuthHeaderIcon } from "@/components/auth/auth-header-icon";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";
import { cx } from "@/utils/cx";

export const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("password") as string;
        const confirm = formData.get("password_confirm") as string;

        if (newPassword !== confirm) {
            setError("Password tidak cocok");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Token reset tidak valid. Silakan minta reset password ulang.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Failed to reset password");
                return;
            }

            router.push("/login?reset=success");
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <AuthHeaderIcon>
                        <LogoWithTitle size="xl" className="relative z-10 justify-center" />
                    </AuthHeaderIcon>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                            Buat Password Baru
                        </h1>
                        <p className="text-md text-tertiary">
                            Password baru harus berbeda dari password sebelumnya.
                        </p>
                    </div>
                </div>

                <Form onSubmit={handleSubmit} className="z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-5">
                        <Input
                            isRequired
                            hideRequiredIndicator
                            label="Password Baru"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            size="md"
                            minLength={8}
                            onChange={setPassword}
                        />
                        <Input
                            isRequired
                            hideRequiredIndicator
                            label="Konfirmasi Password"
                            type="password"
                            name="password_confirm"
                            placeholder="••••••••"
                            size="md"
                            validate={(value) => value === password || "Password tidak cocok"}
                        />

                        {/* Password requirements */}
                        <div className="flex flex-col gap-3">
                            <span className="flex gap-2">
                                <div className={cx(
                                    "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150",
                                    password.length >= 8 ? "bg-fg-success-primary" : ""
                                )}>
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-sm text-tertiary">Minimal 8 karakter</p>
                            </span>
                            <span className="flex gap-2">
                                <div className={cx(
                                    "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150",
                                    password.match(/[!@#$%^&*(),.?":{}|<>]/) ? "bg-fg-success-primary" : ""
                                )}>
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-sm text-tertiary">Mengandung karakter spesial</p>
                            </span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    )}

                    <div className="flex flex-col gap-4">
                        <Button type="submit" size="lg" isLoading={isLoading} disabled={isLoading}>
                            Simpan Password Baru
                        </Button>
                    </div>
                </Form>

                <div className="z-10 flex justify-center">
                    <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-tertiary hover:text-primary">
                        ← Kembali ke Login
                    </Link>
                </div>
            </div>
        </section>
    );
};
