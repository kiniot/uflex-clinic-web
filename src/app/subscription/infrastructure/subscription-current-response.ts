import {
  CurrentSubscriptionSnapshot,
  SubscriptionBillingPeriod,
  SubscriptionCurrency,
} from '../domain/model/subscription-catalog.types';

export interface CurrentSubscriptionResponse extends CurrentSubscriptionSnapshot {
  billingPeriod: SubscriptionBillingPeriod;
  currency: SubscriptionCurrency;
}
