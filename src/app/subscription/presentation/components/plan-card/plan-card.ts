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
  selected = input(false);
  planSelected = output<string>();

  protected isCurrentPlan(): boolean {
    return this.isCurrent();
  }

  protected selectPlan(): void {
    this.planSelected.emit(this.plan().id);
  }
}
