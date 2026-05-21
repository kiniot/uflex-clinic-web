import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SubscriptionPlan} from '../../../domain/model/subscription-plan.entity';

/**
 * Card rendering one subscription tier in the "Available Clinical Plans"
 * comparison. The card highlights itself when it represents the user's
 * current plan and disables the action button accordingly.
 */
@Component({
  selector: 'app-plan-card',
  imports: [TranslatePipe, ButtonModule],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.scss'
})
export class PlanCard {
  plan = input.required<SubscriptionPlan>();
  isCurrent = input<boolean>(false);

  readonly select = output<SubscriptionPlan>();

  protected onSelect() { this.select.emit(this.plan()); }
}
