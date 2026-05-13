import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {InvoiceStatus} from './subscription.types';

/**
 * Invoice entity in the Subscription bounded context.
 */
export class Invoice implements BaseEntity {
  private _id: number;
  private _amount: number;
  private _planName: string;
  private _status: InvoiceStatus;
  private _issuedAtLabel: string;

  constructor(data: {
    id: number;
    amount: number;
    planName: string;
    status: InvoiceStatus;
    issuedAtLabel: string;
  }) {
    this._id = data.id;
    this._amount = data.amount;
    this._planName = data.planName;
    this._status = data.status;
    this._issuedAtLabel = data.issuedAtLabel;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }

  get planName(): string { return this._planName; }
  set planName(value: string) { this._planName = value; }

  get status(): InvoiceStatus { return this._status; }
  set status(value: InvoiceStatus) { this._status = value; }

  get issuedAtLabel(): string { return this._issuedAtLabel; }
  set issuedAtLabel(value: string) { this._issuedAtLabel = value; }
}
