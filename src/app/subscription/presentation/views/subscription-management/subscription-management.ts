import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';
import { SubscriptionStore } from '../../../application/subscription.store';
import {
  PersistedSubscriptionSelection,
  SubscriptionBillingPeriod,
} from '../../../domain/model/subscription-catalog.types';
import { SubscriptionTier } from '../../../domain/model/subscription-tier.entity';

/**
 * Subscription view in the Subscription bounded context. Renders the
 * checkout confirmation states plus the clinic-admin subscription
 * summary backed by the real tiers/current endpoints.
 */
@Component({
  selector: 'app-subscription-management',
  imports: [TranslatePipe, ButtonModule, AuthShell, PageHeader],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss',
})
export class SubscriptionManagement implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(SubscriptionStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  readonly paymentState = signal<'success' | 'cancel' | null>(null);

  protected readonly tiers = this.store.tiers;
  protected readonly pendingSelection = this.store.pendingSelection;
  protected readonly currentSubscriptionSnapshot = this.store.currentSubscriptionSnapshot;
  protected readonly isLoadingCurrentSubscription = this.store.isLoadingCurrentSubscription;
  protected readonly hasResolvedCurrentSubscription = this.store.hasResolvedCurrentSubscription;

  protected readonly currentTier = computed<SubscriptionTier | null>(() => {
    const subscription = this.currentSubscriptionSnapshot();
    if (!subscription) return null;
    return this.tiers().find((tier) => tier.id === subscription.tierId) ?? null;
  });

  async ngOnInit() {
    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment === 'success' || payment === 'cancel') {
      this.paymentState.set(payment);
      await this.store.loadCatalog();
      this.store.hydratePendingSelectionFromStorage();

      if (payment === 'success') {
        await this.store.loadCurrentSubscriptionWithPolling();
      }
      return;
    }

    await Promise.all([this.store.loadCatalog(), this.store.loadCurrentSubscriptionOnce()]);
  }

  protected isConfirmationMode(): boolean {
    return this.paymentState() !== null;
  }

  protected resolvedCurrentTier(): SubscriptionTier | null {
    const subscription = this.currentSubscriptionSnapshot();
    if (!subscription) return null;
    return this.tiers().find((tier) => tier.id === subscription.tierId) ?? null;
  }

  protected pendingTier(): SubscriptionTier | null {
    const selection = this.pendingSelection();
    if (!selection) return null;
    return this.tiers().find((tier) => tier.id === selection.tierId) ?? null;
  }

  protected formatMoney(amount: number | null, currency: string | null): string {
    if (amount == null || !currency) return '--';
    return new Intl.NumberFormat(this.translate.currentLang === 'es' ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected formatDate(date: string | null): string {
    if (!date) return this.translate.instant('subscription.values.notApplicable');
    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return date;

    return new Intl.DateTimeFormat(this.translate.currentLang === 'es' ? 'es-PE' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  }

  protected formatTierName(tier: SubscriptionTier | null, fallback: string): string {
    if (!tier) return fallback;
    return this.translate.instant(`subscription.tiers.${tier.name.toLowerCase()}`);
  }

  protected formatBillingPeriod(period: SubscriptionBillingPeriod): string {
    return this.translate.instant(`subscription.values.billing.${period.toLowerCase()}`);
  }

  protected formatStatus(status: string): string {
    const normalizedStatus = status.toLowerCase();
    const translated = this.translate.instant(`subscription.values.status.${normalizedStatus}`);
    return translated === `subscription.values.status.${normalizedStatus}` ? status : translated;
  }

  protected formatLimit(value: number | null): string {
    if (value == null) return this.translate.instant('subscription.values.unlimited');
    return String(value);
  }

  protected formatAdditionalKits(tier: SubscriptionTier | null): string {
    if (!tier) return this.translate.instant('subscription.values.notApplicable');
    if (!tier.kits.additionalKitsAllowed) {
      return this.translate.instant('subscription.capacity.additionalKits.none');
    }
    if (tier.kits.maxAdditionalKits == null) {
      return this.translate.instant('subscription.capacity.additionalKits.unlimited');
    }

    return this.translate.instant('subscription.capacity.additionalKits.limited', {
      count: tier.kits.maxAdditionalKits,
    });
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
