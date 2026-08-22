import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "../providers/router-provider";
import { Theme } from "../providers/theme";
import "../styles/globals.css";
import { cx } from "../utils/cx";
import { ToastProvider } from "../contexts/use-toast";
import { GlobalToast } from "../components/application/notifications/global-toast";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "LMS Keliling | Language Management System untuk Belajar Bahasa",
    description: "LMS Keliling adalah Language Management System yang membantu kamu belajar bahasa dengan soal Reading, Writing, Speaking, dan Listening bertenaga AI. Tersedia 14+ bahasa, soal unik setiap sesi, dan gratis untuk dicoba.",
    icons: {
        icon: "/logo.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#ffbd59",
    colorScheme: "light dark",
};

import { ConfigProvider } from "../providers/config-provider";
import { AuthProvider } from "../providers/auth-provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(inter.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>
                        <ConfigProvider>
                            <AuthProvider>
                                <ToastProvider>
                                    {children}
                                    <GlobalToast />
                                </ToastProvider>
                            </AuthProvider>
                        </ConfigProvider>
                    </Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
