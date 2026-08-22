import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PricingPlansSection } from "@/components/marketing/pricing-sections/pricing-plans-section";

export const metadata: Metadata = {
    title: "Harga — LMS Keliling",
    description: "Pilih paket LMS Keliling yang sesuai kebutuhanmu. Mulai gratis hingga paket Luxury dengan akses provider AI terbaik untuk belajar bahasa.",
};

export default function HargaPage() {
    return (
        <PageLayout>
            <div className="w-full animate-[fadeSlideUp_0.7s_ease-out_0.1s_both]">
                <PricingPlansSection />
            </div>
        </PageLayout>
    );
}
