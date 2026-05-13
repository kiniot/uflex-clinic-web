import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
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
  isCurrent = input<boolean>(false);
  hasActiveSubscription = input<boolean>(false);
  selected = input(false);
  planSelected = output<string>();

  protected isCurrentPlan(): boolean {
    return this.isCurrent();
  }

  protected cardStyleClass(): string {
    return this.isCurrentPlan()
      ? 'subscription-card plan-card plan-card--selected'
      : 'subscription-card plan-card';
  }

  protected selectPlan(): void {
    if (this.isCurrentPlan()) return;
    this.planSelected.emit(this.plan().id);
  }

  protected buttonLabel(): string {
    if (this.isCurrentPlan()) return 'Active Plan';
    return this.hasActiveSubscription() ? 'Change plan' : 'Select plan';
  }
}
