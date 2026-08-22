import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { ContactSection } from "@/components/marketing/contact-section";

export const metadata: Metadata = {
    title: "Hubungi Kami — LMS Keliling",
    description: "Punya pertanyaan atau ingin berkolaborasi? Hubungi tim LMS Keliling melalui form atau kontak langsung kami.",
};

export default function HubungiPage() {
    return (
        <PageLayout>
            <div className="w-full animate-[fadeSlideUp_0.7s_ease-out_0.1s_both]">
                <ContactSection />
            </div>
        </PageLayout>
    );
}
