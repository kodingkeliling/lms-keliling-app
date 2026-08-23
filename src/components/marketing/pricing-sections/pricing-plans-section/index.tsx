"use client";

import { PricingTierCardBanner } from "../base-components/pricing-tier-card";
import { PLANS, formatPriceWithDiscount } from "@/data/plans";
import SectionHeader from "../../section-header";

const WA_NUMBER = "6281257578571";

const getWaLink = (planName: string, price: string) => {
  const text = encodeURIComponent(
    `Halo Admin Koding Keliling!\n\nSaya ingin memesan paket LMS Keliling - *${planName}* (${price}).\n\nMohon informasi lebih lanjut mengenai cara pembayaran dan aktivasi akun.\n\nTerima kasih!`
  );
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
};

export const PricingPlansSection = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto w-full max-w-container px-4 md:px-8">
        <SectionHeader
          title="Pilih Paket yang Sesuai dengan Kebutuhan Anda"
          subtitle="Mulai dari paket starter hingga paket maksimal, temukan solusi terbaik untuk menguji kemampuan bahasa Anda dengan AI."
          className="mb-12"
        />

        <div className="flex flex-col md:flex-row gap-3">
          {PLANS.map((plan) => {
            const priceInfo = formatPriceWithDiscount(plan);
            return (
              <div key={plan.id} className="flex-1 min-w-0">
                <PricingTierCardBanner
                  title={plan.name}
                  subtitle={priceInfo.current}
                  originalPrice={priceInfo?.original}
                  description={plan.description}
                  features={plan.features}
                  waLink={getWaLink(plan.name, priceInfo.current)}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};