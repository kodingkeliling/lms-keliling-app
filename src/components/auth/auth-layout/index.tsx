import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "@untitledui/icons";
import { APP_NAME, APP_LOGO } from "@/config";
import { LogoWithTitle } from "@/components/shared-assets/logo-with-title";

interface AuthLayoutProps {
    children: React.ReactNode;
    /** Override the bottom-left tagline block on the right panel */
    rightPanelContent?: React.ReactNode;
}

const DefaultRightPanelContent = () => (
    <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-white">
            Belajar bahasa jadi lebih mudah.
        </h2>
        <p className="text-sm text-white/70 leading-relaxed">
            Buat soal latihan yang dipersonalisasi dalam hitungan detik menggunakan kecerdasan buatan.
        </p>
        <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-sm text-white/60">✓ 14+ bahasa tersedia</span>
            <span className="text-sm text-white/60">✓ Soal selalu unik</span>
            <span className="text-sm text-white/60">✓ Reading, Writing, Speaking, Listening</span>
        </div>
    </div>
);

export const AuthLayout = ({ children, rightPanelContent }: AuthLayoutProps) => {
    return (
        <section className="min-h-screen bg-primary lg:pr-[50%]">
            {/* Left Panel */}
            <div className="flex min-h-screen flex-col bg-primary">
                {/* Top breadcrumb nav */}
                <div className="px-4 pt-6 md:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-tertiary transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Beranda
                    </Link>
                </div>

                <div className="flex flex-1 justify-center px-4 py-8 md:items-center md:px-8">
                    <div className="flex w-full flex-col gap-8 sm:max-w-90">
                        {children}
                    </div>
                </div>

                <footer className="hidden p-8 pt-11 lg:block">
                    <p className="text-sm text-tertiary">© {APP_NAME} {new Date().getFullYear()}</p>
                </footer>
            </div>

            {/* Right Panel — fixed decorative */}
            <div className="fixed top-0 right-0 hidden h-screen w-1/2 lg:block">
                {/* Background image + overlay */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="/images/ilustration-01.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-950/55" />
                </div>

                {/* Top-left: logo + app name */}
                <div className="absolute top-8 left-8 z-10">
                    <LogoWithTitle size="sm" forceTheme="dark" />
                </div>

                {/* Bottom-left: tagline + features */}
                <div className="absolute bottom-10 left-8 right-8 z-10">
                    {rightPanelContent ?? <DefaultRightPanelContent />}
                </div>
            </div>
        </section>
    );
};
