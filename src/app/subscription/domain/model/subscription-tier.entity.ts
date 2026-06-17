import { BaseEntity } from '../../../shared/domain/model/base-entity';
import {
  PublicSubscriptionTierSlug,
  SubscriptionBillingPeriod,
  SubscriptionCurrency,
  SubscriptionTierKitConfig,
  SubscriptionTierKitPrice,
  SubscriptionTierLimits,
  SubscriptionTierName,
  SubscriptionTierPrice,
} from './subscription-catalog.types';

const TIER_NAME_TO_SLUG: Partial<Record<SubscriptionTierName, PublicSubscriptionTierSlug>> = {
  PILOT: 'pilot',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

export class SubscriptionTier implements BaseEntity {
  private _id: string;
  private _name: SubscriptionTierName;
  private _allowsPriceOverride: boolean;
  private _limits: SubscriptionTierLimits;
  private _kits: SubscriptionTierKitConfig;
  private _prices: SubscriptionTierPrice[];
  private _kitPrices: SubscriptionTierKitPrice[];

  constructor(data: {
    id: string;
    name: SubscriptionTierName;
    allowsPriceOverride: boolean;
    limits: SubscriptionTierLimits;
    kits: SubscriptionTierKitConfig;
    prices: SubscriptionTierPrice[];
    kitPrices: SubscriptionTierKitPrice[];
  }) {
    this._id = data.id;
    this._name = data.name;
    this._allowsPriceOverride = data.allowsPriceOverride;
    this._limits = data.limits;
    this._kits = data.kits;
    this._prices = data.prices;
    this._kitPrices = data.kitPrices;
  }

  get id(): string {
    return this._id;
  }

  get name(): SubscriptionTierName {
    return this._name;
  }

  get allowsPriceOverride(): boolean {
    return this._allowsPriceOverride;
  }

  get limits(): SubscriptionTierLimits {
    return this._limits;
  }

  get kits(): SubscriptionTierKitConfig {
    return this._kits;
  }

  get prices(): SubscriptionTierPrice[] {
    return this._prices;
  }

  get kitPrices(): SubscriptionTierKitPrice[] {
    return this._kitPrices;
  }

  get slug(): PublicSubscriptionTierSlug | null {
    return TIER_NAME_TO_SLUG[this._name] ?? null;
  }

  get isPublicOnboardingTier(): boolean {
    return this._name !== 'TRIAL';
  }

  get isContactOnly(): boolean {
    return this._name === 'ENTERPRISE';
  }

  getPrice(billingPeriod: SubscriptionBillingPeriod, currency: SubscriptionCurrency): number | null {
    return (
      this._prices.find(
        (price) => price.billingPeriod === billingPeriod && price.currency === currency,
      )?.amount ?? null
    );
  }

  getKitUnitPrice(currency: SubscriptionCurrency): number | null {
    return this._kitPrices.find((price) => price.currency === currency)?.unitAmount ?? null;
  }

  clampRequestedTotalKits(requestedTotalKits: number): number {
    const minimum = this._kits.baseKits;
    const normalized = Number.isFinite(requestedTotalKits)
      ? Math.max(minimum, Math.trunc(requestedTotalKits))
      : minimum;
    const maximum = this.maximumRequestedTotalKits;

    if (maximum == null) return normalized;
    return Math.min(maximum, normalized);
  }

  get maximumRequestedTotalKits(): number | null {
    if (!this._kits.additionalKitsAllowed) return this._kits.baseKits;
    if (this._kits.maxAdditionalKits == null) return null;
    return this._kits.baseKits + this._kits.maxAdditionalKits;
  }
}
