import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CurrentSubscriptionSnapshot,
  PersistedSubscriptionSelection,
  PublicSubscriptionTierSlug,
  SubscriptionBillingPeriod,
  SubscriptionCurrency,
} from '../domain/model/subscription-catalog.types';
import { SubscriptionCheckoutCommand } from '../domain/model/subscription-checkout.command';
import { SubscriptionTier } from '../domain/model/subscription-tier.entity';
import { SubscriptionApi } from '../infrastructure/subscription-api';

/**
 * Application-layer store for the Subscription bounded context. Handles
 * the public catalog used in onboarding plus the authenticated clinic
 * subscription snapshot used in the clinic-admin portal.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore {
  private static readonly pendingSelectionStorageKey = 'pendingSubscriptionCheckout';

  private readonly tiersSignal = signal<SubscriptionTier[]>([]);
  private readonly loadingCatalogSignal = signal(false);
  private readonly catalogResolvedSignal = signal(false);
  private readonly currentTierSlugSignal = signal<PublicSubscriptionTierSlug | null>(null);
  private readonly currentBillingSignal = signal<SubscriptionBillingPeriod>('MONTHLY');
  private readonly currentCurrencySignal = signal<SubscriptionCurrency>('PEN');
  private readonly requestedTotalKitsSignal = signal<number | null>(null);
  private readonly currentSubscriptionSnapshotSignal = signal<CurrentSubscriptionSnapshot | null>(
    null,
  );
  private readonly loadingCurrentSubscriptionSignal = signal(false);
  private readonly currentSubscriptionResolvedSignal = signal(false);
  private readonly pendingSelectionSignal = signal<PersistedSubscriptionSelection | null>(null);

  constructor(private subscriptionApi: SubscriptionApi) {
    this.pendingSelectionSignal.set(this.readPendingSelectionFromStorage());
  }

  readonly tiers = this.tiersSignal.asReadonly();
  readonly isLoadingCatalog = this.loadingCatalogSignal.asReadonly();
  readonly selectedTierSlug = this.currentTierSlugSignal.asReadonly();
  readonly selectedBillingPeriod = this.currentBillingSignal.asReadonly();
  readonly selectedCurrency = this.currentCurrencySignal.asReadonly();
  readonly requestedTotalKits = this.requestedTotalKitsSignal.asReadonly();
  readonly currentSubscriptionSnapshot = this.currentSubscriptionSnapshotSignal.asReadonly();
  readonly isLoadingCurrentSubscription = this.loadingCurrentSubscriptionSignal.asReadonly();
  readonly hasResolvedCurrentSubscription = this.currentSubscriptionResolvedSignal.asReadonly();
  readonly pendingSelection = this.pendingSelectionSignal.asReadonly();

  readonly publicTiers = computed(() =>
    this.tiers()
      .filter((tier) => tier.isPublicOnboardingTier)
      .sort((left, right) => this.tierSortOrder(left) - this.tierSortOrder(right)),
  );

  readonly selectedTier = computed(() => {
    const selectedSlug = this.currentTierSlugSignal();
    if (!selectedSlug) return null;
    return this.publicTiers().find((tier) => tier.slug === selectedSlug) ?? null;
  });

  readonly selectedBasePrice = computed(() => {
    const tier = this.selectedTier();
    if (!tier) return null;
    return tier.getPrice(this.currentBillingSignal(), this.currentCurrencySignal());
  });

  readonly selectedKitUnitPrice = computed(() => {
    const tier = this.selectedTier();
    if (!tier) return null;
    return tier.getKitUnitPrice(this.currentCurrencySignal());
  });

  readonly normalizedRequestedTotalKits = computed(() => {
    const tier = this.selectedTier();
    if (!tier) return null;
    return tier.clampRequestedTotalKits(this.requestedTotalKitsSignal() ?? tier.kits.baseKits);
  });

  readonly additionalKitCount = computed(() => {
    const tier = this.selectedTier();
    const kits = this.normalizedRequestedTotalKits();
    if (!tier || kits == null) return null;
    return Math.max(0, kits - tier.kits.baseKits);
  });

  readonly selectedKitCharge = computed(() => {
    const tier = this.selectedTier();
    const kits = this.normalizedRequestedTotalKits();
    const unitPrice = this.selectedKitUnitPrice();
    if (!tier || kits == null || unitPrice == null) return null;
    return unitPrice * kits;
  });

  readonly selectedGrandTotal = computed(() => {
    const basePrice = this.selectedBasePrice();
    const kitCharge = this.selectedKitCharge();
    if (basePrice == null || kitCharge == null) return null;
    return basePrice + kitCharge;
  });

  readonly canContinueWithSelfServeSelection = computed(() => {
    const tier = this.selectedTier();
    return !!tier && !tier.isContactOnly;
  });

  readonly currentSelection = computed<PersistedSubscriptionSelection | null>(() => {
    const tier = this.selectedTier();
    const amount = this.selectedBasePrice();
    const requestedTotalKits = this.normalizedRequestedTotalKits();
    if (
      !tier ||
      tier.slug == null ||
      amount == null ||
      requestedTotalKits == null ||
      tier.isContactOnly
    ) {
      return null;
    }

    return {
      tierSlug: tier.slug,
      tierId: tier.id,
      billingPeriod: this.currentBillingSignal(),
      currency: this.currentCurrencySignal(),
      amount,
      requestedTotalKits,
    };
  });

  async loadCatalog({ force = false }: { force?: boolean } = {}): Promise<void> {
    if (this.loadingCatalogSignal()) return;
    if (this.catalogResolvedSignal() && !force) return;

    this.loadingCatalogSignal.set(true);
    try {
      const tiers = await firstValueFrom(this.subscriptionApi.getTiers());
      this.tiersSignal.set(tiers);
      this.catalogResolvedSignal.set(true);
      this.normalizeSelection();
    } finally {
      this.loadingCatalogSignal.set(false);
    }
  }

  async loadCurrentSubscriptionOnce({
    force = false,
  }: {
    force?: boolean;
  } = {}): Promise<CurrentSubscriptionSnapshot | null> {
    if (this.loadingCurrentSubscriptionSignal()) {
      return this.currentSubscriptionSnapshotSignal();
    }
    if (this.currentSubscriptionResolvedSignal() && !force) {
      return this.currentSubscriptionSnapshotSignal();
    }

    this.loadingCurrentSubscriptionSignal.set(true);
    try {
      const subscription = await firstValueFrom(this.subscriptionApi.getCurrentSubscription());
      this.currentSubscriptionSnapshotSignal.set(subscription);
      this.currentSubscriptionResolvedSignal.set(true);

      if (subscription) {
        this.clearPendingSelection();
      }

      return subscription;
    } finally {
      this.loadingCurrentSubscriptionSignal.set(false);
    }
  }

  hydrateSelectionFromQuery(params: {
    tier: string | null;
    billing: string | null;
    currency: string | null;
    kits: string | null;
  }) {
    const tierSlug = this.parseTierSlug(params.tier);
    const billingPeriod = this.parseBillingPeriod(params.billing);
    const currency = this.parseCurrency(params.currency);

    this.currentTierSlugSignal.set(tierSlug);
    if (billingPeriod) this.currentBillingSignal.set(billingPeriod);
    if (currency) this.currentCurrencySignal.set(currency);

    const tier = this.resolveTierBySlug(tierSlug);
    if (!tier) {
      this.requestedTotalKitsSignal.set(null);
      return;
    }

    const requestedKits = params.kits ? Number(params.kits) : tier.kits.baseKits;
    this.requestedTotalKitsSignal.set(tier.clampRequestedTotalKits(requestedKits));
    this.normalizeSelection();
  }

  selectTier(slug: PublicSubscriptionTierSlug | null) {
    this.currentTierSlugSignal.set(slug);
    this.normalizeSelection();
  }

  selectBillingPeriod(period: SubscriptionBillingPeriod) {
    this.currentBillingSignal.set(period);
  }

  selectCurrency(currency: SubscriptionCurrency) {
    this.currentCurrencySignal.set(currency);
  }

  updateRequestedTotalKits(value: number) {
    const tier = this.selectedTier();
    if (!tier) return;
    this.requestedTotalKitsSignal.set(tier.clampRequestedTotalKits(value));
  }

  buildQueryParams(): Record<string, string> {
    const params: Record<string, string> = {
      billing: this.currentBillingSignal().toLowerCase(),
      currency: this.currentCurrencySignal().toLowerCase(),
    };

    const tier = this.selectedTier();
    const requestedKits = this.normalizedRequestedTotalKits();

    if (tier?.slug) {
      params['tier'] = tier.slug;
      if (requestedKits != null) {
        params['kits'] = String(requestedKits);
      }
    }

    return params;
  }

  persistCurrentSelection() {
    const selection = this.currentSelection();
    if (!selection) return;
    sessionStorage.setItem(SubscriptionStore.pendingSelectionStorageKey, JSON.stringify(selection));
    this.pendingSelectionSignal.set(selection);
  }

  clearPendingSelection() {
    sessionStorage.removeItem(SubscriptionStore.pendingSelectionStorageKey);
    this.pendingSelectionSignal.set(null);
  }

  async beginCheckoutFromCurrentSelection(): Promise<string> {
    const selection = this.currentSelection();
    if (!selection) throw new Error('No valid self-serve selection is available');
    return this.beginCheckout(selection);
  }

  async retryPendingCheckout(): Promise<string> {
    const selection = this.pendingSelectionSignal();
    if (!selection) throw new Error('No pending checkout selection available');
    return this.beginCheckout(selection);
  }

  async loadCurrentSubscriptionWithPolling({
    maxAttempts = 5,
    intervalMs = 2000,
  }: {
    maxAttempts?: number;
    intervalMs?: number;
  } = {}): Promise<CurrentSubscriptionSnapshot | null> {
    this.loadingCurrentSubscriptionSignal.set(true);
    this.currentSubscriptionResolvedSignal.set(false);

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const subscription = await firstValueFrom(this.subscriptionApi.getCurrentSubscription());
        if (subscription) {
          this.currentSubscriptionSnapshotSignal.set(subscription);
          this.currentSubscriptionResolvedSignal.set(true);
          this.clearPendingSelection();
          return subscription;
        }

        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      this.currentSubscriptionSnapshotSignal.set(null);
      this.currentSubscriptionResolvedSignal.set(true);
      return null;
    } finally {
      this.loadingCurrentSubscriptionSignal.set(false);
    }
  }

  hydratePendingSelectionFromStorage() {
    this.pendingSelectionSignal.set(this.readPendingSelectionFromStorage());
  }

  private async beginCheckout(selection: PersistedSubscriptionSelection): Promise<string> {
    this.persistCurrentSelection();
    const response = await firstValueFrom(
      this.subscriptionApi.checkout(
        new SubscriptionCheckoutCommand({
          tierId: selection.tierId,
          billingPeriod: selection.billingPeriod,
          amount: selection.amount,
          currency: selection.currency,
          requestedTotalKits: selection.requestedTotalKits,
        }),
      ),
    );

    return response.checkoutUrl;
  }

  private readPendingSelectionFromStorage(): PersistedSubscriptionSelection | null {
    const rawValue = sessionStorage.getItem(SubscriptionStore.pendingSelectionStorageKey);
    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue) as PersistedSubscriptionSelection;
    } catch {
      return null;
    }
  }

  private normalizeSelection() {
    const tier = this.selectedTier();
    if (!tier) {
      this.requestedTotalKitsSignal.set(null);
      return;
    }

    const nextRequestedKits = tier.clampRequestedTotalKits(
      this.requestedTotalKitsSignal() ?? tier.kits.baseKits,
    );
    this.requestedTotalKitsSignal.set(nextRequestedKits);
  }

  private parseTierSlug(rawValue: string | null): PublicSubscriptionTierSlug | null {
    if (rawValue === 'pilot' || rawValue === 'professional' || rawValue === 'enterprise') {
      return rawValue;
    }
    return null;
  }

  private parseBillingPeriod(rawValue: string | null): SubscriptionBillingPeriod | null {
    if (!rawValue) return null;
    if (rawValue.toLowerCase() === 'monthly') return 'MONTHLY';
    if (rawValue.toLowerCase() === 'yearly') return 'YEARLY';
    return null;
  }

  private parseCurrency(rawValue: string | null): SubscriptionCurrency | null {
    if (!rawValue) return null;
    if (rawValue.toLowerCase() === 'pen') return 'PEN';
    if (rawValue.toLowerCase() === 'usd') return 'USD';
    return null;
  }

  private resolveTierBySlug(slug: PublicSubscriptionTierSlug | null): SubscriptionTier | null {
    if (!slug) return null;
    return this.publicTiers().find((tier) => tier.slug === slug) ?? null;
  }

  private tierSortOrder(tier: SubscriptionTier): number {
    switch (tier.name) {
      case 'PILOT':
        return 1;
      case 'PROFESSIONAL':
        return 2;
      case 'ENTERPRISE':
        return 3;
      default:
        return 99;
    }
  }
}
