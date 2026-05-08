import {computed, Injectable, signal} from '@angular/core';
import {ActiveSubscription} from '../domain/model/active-subscription.entity';
import {Invoice} from '../domain/model/invoice.entity';
import {PaymentMethod} from '../domain/model/payment-method.entity';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';
import {
  MOCK_ACTIVE_SUBSCRIPTION,
  MOCK_INVOICES,
  MOCK_PAYMENT_METHOD,
  MOCK_PLANS
} from '../infrastructure/subscription.mock';

/**
 * Application-layer store for the Subscription bounded context. Exposes
 * the active subscription, available plans, billing history, and payment
 * method as signals; computed signals derive license/storage usage
 * percentages and resolve the currently-active plan reference.
 */
@Injectable({providedIn: 'root'})
export class SubscriptionStore {
  private readonly plansSignal = signal<SubscriptionPlan[]>(MOCK_PLANS);
  private readonly activeSubscriptionSignal = signal<ActiveSubscription>(MOCK_ACTIVE_SUBSCRIPTION);
  private readonly paymentMethodSignal = signal<PaymentMethod>(MOCK_PAYMENT_METHOD);
  private readonly invoicesSignal = signal<Invoice[]>(MOCK_INVOICES);

  readonly plans = this.plansSignal.asReadonly();
  readonly activeSubscription = this.activeSubscriptionSignal.asReadonly();
  readonly paymentMethod = this.paymentMethodSignal.asReadonly();
  readonly invoices = this.invoicesSignal.asReadonly();

  readonly activePlan = computed<SubscriptionPlan | null>(() => {
    const planId = this.activeSubscription().planId;
    return this.plans().find(p => p.id === planId) ?? null;
  });

  readonly licensesUsagePct = computed(() => {
    const sub = this.activeSubscription();
    if (sub.totalLicenses === 0) return 0;
    return Math.round((sub.activeLicenses / sub.totalLicenses) * 100);
  });

  /** Storage usage as a percentage of an assumed 2TB cap (mock). */
  readonly storageUsagePct = computed(() => {
    const cap = 2;
    return Math.min(100, Math.round((this.activeSubscription().storageUsageTb / cap) * 100));
  });
}
