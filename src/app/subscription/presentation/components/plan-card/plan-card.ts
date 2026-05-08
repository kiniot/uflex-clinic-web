import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SubscriptionPlan} from '../../../domain/model/subscription-plan.entity';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionPlan } from '../../../domain/models/subscription-plan';

/**
 * Card rendering one subscription tier in the "Available Clinical Plans"
 * comparison. The card highlights itself when it represents the user's
 * current plan and disables the action button accordingly.
 * Internal visual card for available Subscription plans.
 */
@Component({
  selector: 'app-plan-card',
  imports: [TranslatePipe, ButtonModule],
  imports: [ButtonModule, CardModule],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.scss'
  styleUrl: './plan-card.scss',
})
export class PlanCard {
  plan = input.required<SubscriptionPlan>();
  isCurrent = input<boolean>(false);
  currentSubscription = input.required<Subscription | null>();
  selected = input(false);
  planSelected = output<string>();

  readonly select = output<SubscriptionPlan>();
  readonly billingCycle = BillingCycle.Monthly;

  protected onSelect() { this.select.emit(this.plan()); }
  isCurrent(): boolean {
    return this.currentSubscription()?.plan.id === this.plan().id;
  }

  selectPlan(): void {
    this.planSelected.emit(this.plan().id);
  }
}
