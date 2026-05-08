/**
 * Domain enumerations for the Subscription bounded context.
 */

export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export type BillingCycle = 'monthly' | 'annual';

export type ApiHealthStatus = 'healthy' | 'degraded' | 'down';

export interface PlanFeature {
  label: string;
  included: boolean;
}
