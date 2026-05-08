import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * PaymentMethod entity in the Subscription bounded context. Holds the
 * non-sensitive card data shown on the subscription page (last four
 * digits, holder, expiry).
 */
export class PaymentMethod implements BaseEntity {
  private _id: number;
  private _last4: string;
  private _cardHolder: string;
  private _expiryLabel: string;

  constructor(data: {id: number; last4: string; cardHolder: string; expiryLabel: string}) {
    this._id = data.id;
    this._last4 = data.last4;
    this._cardHolder = data.cardHolder;
    this._expiryLabel = data.expiryLabel;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get last4(): string { return this._last4; }
  set last4(value: string) { this._last4 = value; }

  get cardHolder(): string { return this._cardHolder; }
  set cardHolder(value: string) { this._cardHolder = value; }

  get expiryLabel(): string { return this._expiryLabel; }
  set expiryLabel(value: string) { this._expiryLabel = value; }
}
