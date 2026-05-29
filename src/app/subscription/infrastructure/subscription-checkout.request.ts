import { SubscriptionBillingPeriod, SubscriptionCurrency } from '../domain/model/subscription-catalog.types';

export interface SubscriptionCheckoutRequest {
  tierId: string;
  billingPeriod: SubscriptionBillingPeriod;
  amount: string;
  currency: SubscriptionCurrency;
  requestedTotalKits: number;
}
