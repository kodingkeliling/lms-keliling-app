export type AIProvider = 'auto' | 'groq' | 'deepseek' | 'gemini' | 'claude' | 'openai' | 'custom';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  questionLimit: number;
  providers: AIProvider[];
  features: string[];
  badge?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export const PLANS: PricingPlan[] = [
  {
    id: 'starter-100',
    name: 'Premium',
    description: 'Cocok untuk latihan rutin bulanan',
    price: 5000,
    currency: 'Rp',
    questionLimit: 100,
    providers: ['auto', 'groq', 'deepseek', 'gemini'],
    features: [
      'Membuat 100 soal',
      'Expired per-bulan',
    ]
  },
  {
    id: 'pro-500',
    name: 'Eksklusif',
    description: 'Pilihan paling pas untuk latihan intensif',
    price: 7500,
    originalPrice: 10000,
    currency: 'Rp',
    questionLimit: 500,
    providers: ['auto', 'groq', 'deepseek', 'gemini', 'custom'],
    features: [
      'Membuat 500 soal',
      'Expired per-bulan',
    ],
    badge: 'PROMO',
    isPopular: true
  },
  {
    id: 'ultimate-1000',
    name: 'Luxury',
    description: 'Paket maksimal untuk persiapan ujian',
    price: 20000,
    currency: 'Rp',
    questionLimit: 1000,
    providers: ['auto', 'groq', 'deepseek', 'gemini', 'claude', 'openai', 'custom'],
    features: [
      'Membuat 1000 soal',
      'Expired per-bulan',
    ],
    isRecommended: true
  }
];

export function formatPrice(plan: PricingPlan): string {
  if (plan.price === 0) {
    return `${plan.currency}0`;
  }
  return `${plan.currency}${plan.price.toLocaleString('id-ID')}`;
}

export function formatPriceWithDiscount(plan: PricingPlan): { current: string; original?: string } {
  if (plan.price === 0) {
    return { current: `${plan.currency}0` };
  }

  const current = `${plan.currency}${plan.price.toLocaleString('id-ID')}`;

  if (plan.originalPrice) {
    const original = `${plan.currency}${plan.originalPrice.toLocaleString('id-ID')}`;
    return { current, original };
  }

  return { current };
}

export function getPlanById(id: string): PricingPlan | undefined {
  return PLANS.find(plan => plan.id === id);
}

export function getProviderDisplayName(provider: AIProvider): string {
  const providerNames: Record<AIProvider, string> = {
    auto: 'Auto',
    groq: 'Groq',
    deepseek: 'Deepseek',
    gemini: 'Gemini',
    claude: 'Claude',
    openai: 'OpenAI',
    custom: 'Custom API Key'
  };
  return providerNames[provider];
}

export function getProvidersDisplay(providers: AIProvider[]): string {
  return providers.map(provider => getProviderDisplayName(provider)).join(', ');
}