import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordPage } from "@/components/auth/reset-password-page";

export const metadata: Metadata = {
    title: "Reset Password – LMS Keliling",
    description: "Buat password baru untuk akun LMS Keliling Anda.",
};

export default function ResetPasswordRoute() {
    return (
        <Suspense>
            <ResetPasswordPage />
        </Suspense>
    );
}
