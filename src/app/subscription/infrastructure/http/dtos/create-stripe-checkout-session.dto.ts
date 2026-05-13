import { BillingCycle } from '../../../domain/models/billing-cycle.enum';

export interface CreateStripeCheckoutSessionDto {
  planId: string;
  billingCycle: BillingCycle;
}
