import {
  SubscriptionBillingPeriod,
  SubscriptionCurrency,
  SubscriptionTierName,
} from '../domain/model/subscription-catalog.types';

export interface SubscriptionTierResponse {
  id: string;
  name: SubscriptionTierName;
  allowsPriceOverride: boolean;
  limits: {
    maxIotKits: number | null;
    maxPatients: number | null;
    maxPhysiotherapists: number | null;
  };
  kits: {
    baseKits: number;
    additionalKitsAllowed: boolean;
    maxAdditionalKits: number | null;
  };
  prices: Array<{
    billingPeriod: SubscriptionBillingPeriod;
    currency: SubscriptionCurrency;
    amount: number;
  }>;
  kitPrices: Array<{
    currency: SubscriptionCurrency;
    unitAmount: number;
  }>;
}
