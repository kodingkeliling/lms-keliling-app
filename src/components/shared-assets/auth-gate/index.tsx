"use client";

import { useRouter } from "next/navigation";
import { LogIn01, Home01, Lock01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface AuthGateProps {
    /** Path to redirect back to after login. E.g. `/result/abc123` */
    redirectAfterLogin?: string;
    title?: string;
    description?: string;
}

export const AuthGate = ({
    redirectAfterLogin,
    title = "Login untuk Melanjutkan",
    description = "Buat akun atau login terlebih dahulu untuk mengakses fitur ini.",
}: AuthGateProps) => {
    const router = useRouter();

    const loginPath = redirectAfterLogin
        ? `/login?redirect=${encodeURIComponent(redirectAfterLogin)}`
        : "/login";

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-secondary bg-primary p-10 shadow-xl text-center flex flex-col items-center gap-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Lock01 className="size-8" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-primary">{title}</h1>
                    <p className="text-sm text-tertiary leading-relaxed">{description}</p>
                </div>
                <div className="flex flex-col w-full gap-3">
                    <Button
                        size="lg"
                        iconLeading={LogIn01}
                        onClick={() => router.push(loginPath)}
                        className="w-full"
                    >
                        Login Sekarang
                    </Button>
                    <Button
                        size="lg"
                        color="secondary"
                        onClick={() => router.push("/register")}
                        className="w-full"
                    >
                        Daftar Gratis
                    </Button>
                    <Button
                        size="sm"
                        color="tertiary"
                        iconLeading={Home01}
                        onClick={() => router.push("/")}
                        className="w-full"
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        </div>
    );
};
