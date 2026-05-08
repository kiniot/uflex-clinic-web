import {DecimalPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {SubscriptionStore} from '../../../application/subscription.store';
import {SubscriptionPlan} from '../../../domain/model/subscription-plan.entity';
import {BillingHistoryTable} from '../../components/billing-history-table/billing-history-table';
import {PaymentCard} from '../../components/payment-card/payment-card';
import {PlanCard} from '../../components/plan-card/plan-card';

/**
 * Subscription view in the Subscription bounded context. Renders the
 * page header, the active plan card with usage stats, the payment card,
 * billing history, an upsell card, and the available plans comparison.
 */
@Component({
  selector: 'app-subscription-management',
  imports: [
    DecimalPipe,
    TranslatePipe,
    ButtonModule,
    PageHeader,
    PlanCard,
    PaymentCard,
    BillingHistoryTable
  ],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss'
})
export class SubscriptionManagement {
  private readonly store = inject(SubscriptionStore);

  protected readonly activeSubscription = this.store.activeSubscription;
  protected readonly activePlan = this.store.activePlan;
  protected readonly plans = this.store.plans;
  protected readonly invoices = this.store.invoices;
  protected readonly paymentMethod = this.store.paymentMethod;
  protected readonly licensesUsagePct = this.store.licensesUsagePct;
  protected readonly storageUsagePct = this.store.storageUsagePct;

  protected isCurrent(plan: SubscriptionPlan): boolean {
    return plan.id === this.activeSubscription().planId;
  }

  protected onPlanSelect(plan: SubscriptionPlan) {
    console.log('Plan selected', plan.name);
  }

  protected onDownloadAuditReport() { console.log('Download audit report'); }
  protected onUpgradePlan() { console.log('Upgrade plan'); }
  protected onChangeBillingCycle() { console.log('Change billing cycle'); }
  protected onCancelSubscription() { console.log('Cancel subscription'); }
  protected onUpdatePaymentMethod() { console.log('Update payment method'); }
  protected onLearnMore() { console.log('Learn more about clinical research'); }
}
