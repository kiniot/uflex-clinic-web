import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingCycle } from '../models/billing-cycle.enum';
import { Subscription } from '../models/subscription';

export interface SubscriptionRepository {
  findCurrentByClinicId(clinicId: string): Observable<Subscription | null>;
  purchase(
    clinicId: string,
    planId: string,
    billingCycle: BillingCycle,
    paymentToken: string,
  ): Observable<Subscription>;
  cancel(subscriptionId: string, reason: string): Observable<Subscription>;
  changePlan(
    subscriptionId: string,
    newPlanId: string,
    newBillingCycle: BillingCycle,
  ): Observable<Subscription>;
  updatePaymentMethod(subscriptionId: string, paymentToken: string): Observable<Subscription>;
}

export const SUBSCRIPTION_REPOSITORY = new InjectionToken<SubscriptionRepository>(
  'SubscriptionRepository',
);
