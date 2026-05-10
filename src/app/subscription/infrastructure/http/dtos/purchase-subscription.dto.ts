import { BillingCycle } from '../../../domain/models/billing-cycle.enum';

export interface PurchaseSubscriptionDto {
  clinicId: string;
  planId: string;
  billingCycle: BillingCycle;
  paymentToken: string;
}
