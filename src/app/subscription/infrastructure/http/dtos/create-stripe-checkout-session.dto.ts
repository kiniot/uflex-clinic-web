import { BillingCycle } from '../../../domain/models/billing-cycle.enum';

export interface CreateStripeCheckoutSessionDto {
  clinicId: string;
  planId: string;
  billingCycle: BillingCycle;
}
