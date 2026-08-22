import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterPage } from "@/components/auth/register-page";

export const metadata: Metadata = {
    title: "Daftar – LMS Keliling",
    description: "Buat akun LMS Keliling dan mulai perjalanan belajar bahasa Anda.",
};

export default function RegisterRoute() {
    return (
        <Suspense>
            <RegisterPage />
        </Suspense>
    );
}
