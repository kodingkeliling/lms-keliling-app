import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
    title: "Lupa Password – LMS Keliling",
    description: "Reset password akun LMS Keliling Anda.",
};

export default function ForgotPasswordRoute() {
    return <ForgotPasswordPage />;
}
