"use client";

import { PricingTierCardBanner } from "./base-components/pricing-tier-card";
import { PLANS, formatPrice, formatPriceWithDiscount } from "@/data/plans";

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
        <div className="text-center mb-12">
          <h2 className="text-display-md font-semibold text-primary md:text-display-lg">
            Pilih Paket yang Sesuai dengan Kebutuhan Anda
          </h2>
          <p className="mt-4 text-lg text-tertiary md:text-xl max-w-2xl mx-auto">
            Mulai dari gratis hingga paket professional, temukan solusi terbaik untuk menguji kemampuan bahasa Anda dengan AI.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {PLANS.map((plan, index) => {
            const priceInfo = formatPriceWithDiscount(plan);
            return (
              <div key={plan.id} className="flex-1 min-w-0">
                <PricingTierCardBanner
                  // banner={index === 1 ? "PROMO" : undefined}
                  title={plan.name}
                  subtitle={priceInfo.current}
                  originalPrice={priceInfo?.original}
                  description={plan.description}
                  features={plan.features}
                  waLink={getWaLink(plan.name, priceInfo.current)}
                  // secondAction="Pelajari lebih lanjut"
                  className="h-full"
                />
              </div>
            );
          })}
        </div>

        {/* Pricing Comparison Table */}
        <div className="mt-16 rounded-2xl border border-secondary bg-primary p-6 md:p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">Perbandingan Fitur</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-secondary">
                  <th className="pb-4 text-left text-sm font-medium text-tertiary">Fitur</th>
                  {PLANS.map((plan) => (
                    <th key={plan.id} className="pb-4 text-center text-sm font-semibold text-primary">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-secondary">
                  <td className="py-4 text-sm text-tertiary">Jumlah Soal</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 text-center text-sm font-medium text-primary">
                      {plan.questionLimit === 200 || plan.questionLimit === 1000 ? `${plan.questionLimit}+` : plan.questionLimit}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-secondary">
                  <td className="py-4 text-sm text-tertiary">Harga</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 text-center text-sm font-medium text-primary">
                      {formatPrice(plan)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-secondary">
                  <td className="py-4 text-sm text-tertiary">Custom API Key</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 text-center">
                      {plan.providers.includes('custom') ? (
                        <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-1 text-xs font-medium text-success-700">
                          ✓ Tersedia
                        </span>
                      ) : (
                        <span className="text-sm text-tertiary">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-secondary">
                  <td className="py-4 text-sm text-tertiary">Priority Support</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 text-center">
                      {plan.id !== 'free-trial' ? (
                        <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-1 text-xs font-medium text-success-700">
                          ✓ Tersedia
                        </span>
                      ) : (
                        <span className="text-sm text-tertiary">Terbatas</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 text-sm text-tertiary">Jumlah Provider AI</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 text-center text-sm font-medium text-primary">
                      {plan.providers.length}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};