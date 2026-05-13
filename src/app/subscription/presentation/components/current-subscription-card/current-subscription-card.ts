import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionStatus } from '../../../domain/models/subscription-status.enum';

/**
 * Internal visual card for the clinic's current Subscription status.
 */
@Component({
  selector: 'app-current-subscription-card',
  imports: [CardModule, TagModule, DatePipe],
  templateUrl: './current-subscription-card.html',
  styleUrl: './current-subscription-card.scss',
})
export class CurrentSubscriptionCard {
  subscription = input.required<Subscription | null>();

  billingCycleLabel(subscription: Subscription): string {
    return subscription.billingCycle === 'YEARLY' ? '/ year' : '/ month';
  }

  planPrice(subscription: Subscription): string {
    return subscription.billingCycle === BillingCycle.Yearly
      ? subscription.plan.yearlyPrice.formatted()
      : subscription.plan.monthlyPrice.formatted();
  }

  isActive(subscription: Subscription): boolean {
    return subscription.status === SubscriptionStatus.Active;
  }
}
