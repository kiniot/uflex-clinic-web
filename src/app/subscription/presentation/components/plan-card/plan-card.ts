import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionPlan } from '../../../domain/models/subscription-plan';

/**
 * Internal visual card for available Subscription plans.
 */
@Component({
  selector: 'app-plan-card',
  imports: [ButtonModule, CardModule],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.scss',
})
export class PlanCard {
  plan = input.required<SubscriptionPlan>();
  currentSubscription = input.required<Subscription | null>();
  selected = input(false);
  planSelected = output<string>();

  readonly billingCycle = BillingCycle.Monthly;

  isCurrent(): boolean {
    return this.currentSubscription()?.plan.id === this.plan().id;
  }

  selectPlan(): void {
    this.planSelected.emit(this.plan().id);
  }
}
