import { Component, OnInit, inject } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { SubscriptionFacade } from '../../../application/services/subscription-facade';
import { CurrentSubscriptionCard } from '../../components/current-subscription-card/current-subscription-card';
import { InvoiceHistoryTable } from '../../components/invoice-history-table/invoice-history-table';
import { PaymentMethodCard } from '../../components/payment-method-card/payment-method-card';
import { PlanCard } from '../../components/plan-card/plan-card';

/**
 * Internal Subscription page content rendered inside the existing app layout.
 */
@Component({
  selector: 'app-subscription-page',
  imports: [
    CurrentSubscriptionCard,
    InvoiceHistoryTable,
    MessageModule,
    PaymentMethodCard,
    PlanCard,
    ProgressSpinnerModule,
  ],
  templateUrl: './subscription-page.html',
  styleUrl: './subscription-page.scss',
})
export class SubscriptionPage implements OnInit {
  readonly facade = inject(SubscriptionFacade);

  ngOnInit(): void {
    this.facade.load();
  }

  selectPlan(planId: string): void {
    const current = this.facade.currentSubscription();
    if (current) {
      this.facade.changePlan(current.id, planId, BillingCycle.Monthly);
      return;
    }

    this.facade.purchase(planId, BillingCycle.Monthly);
  }

  updatePaymentMethod(): void {
    const current = this.facade.currentSubscription();
    if (!current) return;
    this.facade.updatePaymentMethod(current.id);
  }
}
