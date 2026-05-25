export type SubscriptionBillingPeriod = 'MONTHLY' | 'YEARLY';

export type SubscriptionCurrency = 'PEN' | 'USD';

export type SubscriptionTierName = 'TRIAL' | 'PILOT' | 'PROFESSIONAL' | 'ENTERPRISE';

export type PublicSubscriptionTierSlug = 'pilot' | 'professional' | 'enterprise';

export interface SubscriptionTierLimits {
  maxIotKits: number | null;
  maxPatients: number | null;
  maxPhysiotherapists: number | null;
}

export interface SubscriptionTierKitConfig {
  baseKits: number;
  additionalKitsAllowed: boolean;
  maxAdditionalKits: number | null;
}

export interface SubscriptionTierPrice {
  billingPeriod: SubscriptionBillingPeriod;
  currency: SubscriptionCurrency;
  amount: number;
}

export interface SubscriptionTierKitPrice {
  currency: SubscriptionCurrency;
  unitAmount: number;
}

export interface PersistedSubscriptionSelection {
  tierSlug: PublicSubscriptionTierSlug;
  tierId: string;
  billingPeriod: SubscriptionBillingPeriod;
  currency: SubscriptionCurrency;
  amount: number;
  requestedTotalKits: number;
}

export interface CurrentSubscriptionSnapshot {
  id: string;
  tierId: string;
  billingPeriod: SubscriptionBillingPeriod;
  amount: number;
  currency: SubscriptionCurrency;
  status: string;
  startedAt: string | null;
  renewsAt: string | null;
  endsAt: string | null;
}
