import { SubscriptionBillingPeriod, SubscriptionCurrency } from './subscription-catalog.types';

export class SubscriptionCheckoutCommand {
  private _tierId: string;
  private _billingPeriod: SubscriptionBillingPeriod;
  private _amount: number;
  private _currency: SubscriptionCurrency;
  private _requestedTotalKits: number;

  constructor(data: {
    tierId: string;
    billingPeriod: SubscriptionBillingPeriod;
    amount: number;
    currency: SubscriptionCurrency;
    requestedTotalKits: number;
  }) {
    this._tierId = data.tierId;
    this._billingPeriod = data.billingPeriod;
    this._amount = data.amount;
    this._currency = data.currency;
    this._requestedTotalKits = data.requestedTotalKits;
  }

  get tierId(): string {
    return this._tierId;
  }

  get billingPeriod(): SubscriptionBillingPeriod {
    return this._billingPeriod;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): SubscriptionCurrency {
    return this._currency;
  }

  get requestedTotalKits(): number {
    return this._requestedTotalKits;
  }
}
