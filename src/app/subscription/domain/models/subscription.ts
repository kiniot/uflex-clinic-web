import { BillingCycle } from './billing-cycle.enum';
import { SubscriptionStatus } from './subscription-status.enum';
import { SubscriptionPlan } from './subscription-plan';
import { PaymentReference } from '../value-objects/payment-reference';

/**
 * Domain model for the clinic's current SaaS subscription lifecycle.
 */
export class Subscription {
  constructor(
    private readonly idValue: string,
    private readonly clinicIdValue: string,
    private readonly planValue: SubscriptionPlan,
    private readonly statusValue: SubscriptionStatus,
    private readonly billingCycleValue: BillingCycle,
    private readonly currentPeriodStartValue: Date,
    private readonly currentPeriodEndValue: Date,
    private readonly nextBillingDateValue: Date,
    private readonly paymentReferenceValue: PaymentReference,
  ) {}

  get id(): string {
    return this.idValue;
  }

  get clinicId(): string {
    return this.clinicIdValue;
  }

  get plan(): SubscriptionPlan {
    return this.planValue;
  }

  get status(): SubscriptionStatus {
    return this.statusValue;
  }

  get billingCycle(): BillingCycle {
    return this.billingCycleValue;
  }

  get currentPeriodStart(): Date {
    return this.currentPeriodStartValue;
  }

  get currentPeriodEnd(): Date {
    return this.currentPeriodEndValue;
  }

  get nextBillingDate(): Date {
    return this.nextBillingDateValue;
  }

  get paymentReference(): PaymentReference {
    return this.paymentReferenceValue;
  }
}
