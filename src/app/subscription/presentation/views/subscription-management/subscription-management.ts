import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';
import { SubscriptionStore } from '../../../application/subscription.store';
import { PersistedSubscriptionSelection } from '../../../domain/model/subscription-catalog.types';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { SubscriptionTier } from '../../../domain/model/subscription-tier.entity';
import { BillingHistoryTable } from '../../components/billing-history-table/billing-history-table';
import { PaymentCard } from '../../components/payment-card/payment-card';
import { PlanCard } from '../../components/plan-card/plan-card';

/**
 * Subscription view in the Subscription bounded context. Renders the
 * page header, the active plan card with usage stats, the payment card,
 * billing history, an upsell card, and the available plans comparison.
 */
@Component({
  selector: 'app-subscription-management',
  imports: [
    TranslatePipe,
    ButtonModule,
    AuthShell,
    PageHeader,
    PlanCard,
    PaymentCard,
    BillingHistoryTable
  ],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss'
})
export class SubscriptionManagement implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(SubscriptionStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  readonly paymentState = signal<'success' | 'cancel' | null>(null);

  protected readonly activeSubscription = this.store.activeSubscription;
  protected readonly activePlan = this.store.activePlan;
  protected readonly plans = this.store.plans;
  protected readonly invoices = this.store.invoices;
  protected readonly paymentMethod = this.store.paymentMethod;
  protected readonly licensesUsagePct = this.store.licensesUsagePct;
  protected readonly storageUsagePct = this.store.storageUsagePct;
  protected readonly publicTiers = this.store.publicTiers;
  protected readonly pendingSelection = this.store.pendingSelection;
  protected readonly currentSubscriptionSnapshot = this.store.currentSubscriptionSnapshot;
  protected readonly isLoadingCurrentSubscription = this.store.isLoadingCurrentSubscription;
  protected readonly hasResolvedCurrentSubscription = this.store.hasResolvedCurrentSubscription;

  async ngOnInit() {
    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment !== 'success' && payment !== 'cancel') return;

    this.paymentState.set(payment);
    await this.store.loadCatalog();
    this.store.hydratePendingSelectionFromStorage();

    if (payment === 'success') {
      await this.store.loadCurrentSubscriptionWithPolling();
    }
  }

  protected isCurrent(plan: SubscriptionPlan): boolean {
    return plan.id === this.activeSubscription().planId;
  }

  protected isConfirmationMode(): boolean {
    return this.paymentState() !== null;
  }

  protected resolvedCurrentTier(): SubscriptionTier | null {
    const subscription = this.currentSubscriptionSnapshot();
    if (!subscription) return null;
    return this.publicTiers().find((tier) => tier.id === subscription.tierId) ?? null;
  }

  protected pendingTier(): SubscriptionTier | null {
    const selection = this.pendingSelection();
    if (!selection) return null;
    return this.publicTiers().find((tier) => tier.id === selection.tierId) ?? null;
  }

  protected formatMoney(amount: number | null, currency: string | null): string {
    if (amount == null || !currency) return '--';
    return new Intl.NumberFormat(this.translate.currentLang === 'es' ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected displayTierName(tier: SubscriptionTier | null, fallback: string): string {
    if (!tier?.slug) return fallback;
    return this.translate.instant(`signUp.planStep.tiers.${tier.slug}.name`);
  }

  protected async onRetryCheckout() {
    try {
      const checkoutUrl = await this.store.retryPendingCheckout();
      window.location.assign(checkoutUrl);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('subscription.checkout.retryErrorSummary'),
        detail: this.translate.instant('subscription.checkout.retryErrorDetail'),
        life: 4500,
      });
    }
  }

  protected async onChangePlan() {
    const selection = this.pendingSelection();
    const queryParams = this.selectionToQueryParams(selection);
    await this.router.navigate(['/sign-up'], { queryParams });
  }

  protected async onContinueToPortal() {
    await this.router.navigate(['/clinic-admin/therapy']);
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

  private selectionToQueryParams(selection: PersistedSubscriptionSelection | null) {
    if (!selection) return {};

    return {
      tier: selection.tierSlug,
      billing: selection.billingPeriod.toLowerCase(),
      currency: selection.currency.toLowerCase(),
      kits: selection.requestedTotalKits,
    };
  }
}
