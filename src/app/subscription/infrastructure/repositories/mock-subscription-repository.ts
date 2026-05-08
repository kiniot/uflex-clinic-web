import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Subscription } from '../../domain/models/subscription';
import { SubscriptionStatus } from '../../domain/models/subscription-status.enum';
import { SubscriptionRepository } from '../../domain/repositories/subscription-repository';
import { PaymentReference } from '../../domain/value-objects/payment-reference';
import { mockCurrentSubscription, mockPlans } from '../mock/subscription-mock-data';

/**
 * Mock repository for subscription actions; keeps Culqi and backend calls out of Part 1.
 */
@Injectable({ providedIn: 'root' })
export class MockSubscriptionRepository implements SubscriptionRepository {
  findCurrentByClinicId(clinicId: string): Observable<Subscription | null> {
    return of(mockCurrentSubscription.clinicId === clinicId ? mockCurrentSubscription : null);
  }

  purchase(
    planId: string,
    billingCycle: BillingCycle,
    paymentToken: string,
  ): Observable<Subscription> {
    const plan = mockPlans.find((item) => item.id === planId) ?? mockPlans[1];
    return of(
      new Subscription(
        'sub-demo-001',
        'clinic-demo-001',
        plan,
        SubscriptionStatus.Active,
        billingCycle,
        new Date('2026-05-15T00:00:00'),
        new Date('2026-06-14T23:59:59'),
        new Date('2026-06-15T00:00:00'),
        new PaymentReference(paymentToken, '4242', '12/2028'),
      ),
    );
  }

  cancel(subscriptionId: string, reason: string): Observable<Subscription> {
    void subscriptionId;
    void reason;
    return of(
      new Subscription(
        mockCurrentSubscription.id,
        mockCurrentSubscription.clinicId,
        mockCurrentSubscription.plan,
        SubscriptionStatus.Cancelled,
        mockCurrentSubscription.billingCycle,
        mockCurrentSubscription.currentPeriodStart,
        mockCurrentSubscription.currentPeriodEnd,
        mockCurrentSubscription.nextBillingDate,
        mockCurrentSubscription.paymentReference,
      ),
    );
  }

  changePlan(
    subscriptionId: string,
    newPlanId: string,
    newBillingCycle: BillingCycle,
  ): Observable<Subscription> {
    void subscriptionId;
    const plan = mockPlans.find((item) => item.id === newPlanId) ?? mockCurrentSubscription.plan;
    return of(
      new Subscription(
        mockCurrentSubscription.id,
        mockCurrentSubscription.clinicId,
        plan,
        SubscriptionStatus.Active,
        newBillingCycle,
        mockCurrentSubscription.currentPeriodStart,
        mockCurrentSubscription.currentPeriodEnd,
        mockCurrentSubscription.nextBillingDate,
        mockCurrentSubscription.paymentReference,
      ),
    );
  }

  updatePaymentMethod(subscriptionId: string, paymentToken: string): Observable<Subscription> {
    void subscriptionId;
    return of(
      new Subscription(
        mockCurrentSubscription.id,
        mockCurrentSubscription.clinicId,
        mockCurrentSubscription.plan,
        mockCurrentSubscription.status,
        mockCurrentSubscription.billingCycle,
        mockCurrentSubscription.currentPeriodStart,
        mockCurrentSubscription.currentPeriodEnd,
        mockCurrentSubscription.nextBillingDate,
        new PaymentReference(paymentToken, '4242', '12/2028'),
      ),
    );
  }
}
