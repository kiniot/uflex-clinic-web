import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {ApiHealthStatus, BillingCycle} from './subscription.types';

/**
 * ActiveSubscription entity in the Subscription bounded context. Represents
 * the clinic's currently-active plan, its renewal info, and the live usage
 * stats shown on the subscription page.
 */
export class ActiveSubscription implements BaseEntity {
  private _id: number;
  private _planId: number;
  private _renewsAtLabel: string;
  private _billingCycle: BillingCycle;
  private _activeLicenses: number;
  private _totalLicenses: number;
  private _storageUsageTb: number;
  private _apiStatus: ApiHealthStatus;

  constructor(data: {
    id: number;
    planId: number;
    renewsAtLabel: string;
    billingCycle: BillingCycle;
    activeLicenses: number;
    totalLicenses: number;
    storageUsageTb: number;
    apiStatus: ApiHealthStatus;
  }) {
    this._id = data.id;
    this._planId = data.planId;
    this._renewsAtLabel = data.renewsAtLabel;
    this._billingCycle = data.billingCycle;
    this._activeLicenses = data.activeLicenses;
    this._totalLicenses = data.totalLicenses;
    this._storageUsageTb = data.storageUsageTb;
    this._apiStatus = data.apiStatus;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get planId(): number { return this._planId; }
  set planId(value: number) { this._planId = value; }

  get renewsAtLabel(): string { return this._renewsAtLabel; }
  set renewsAtLabel(value: string) { this._renewsAtLabel = value; }

  get billingCycle(): BillingCycle { return this._billingCycle; }
  set billingCycle(value: BillingCycle) { this._billingCycle = value; }

  get activeLicenses(): number { return this._activeLicenses; }
  set activeLicenses(value: number) { this._activeLicenses = value; }

  get totalLicenses(): number { return this._totalLicenses; }
  set totalLicenses(value: number) { this._totalLicenses = value; }

  get storageUsageTb(): number { return this._storageUsageTb; }
  set storageUsageTb(value: number) { this._storageUsageTb = value; }

  get apiStatus(): ApiHealthStatus { return this._apiStatus; }
  set apiStatus(value: ApiHealthStatus) { this._apiStatus = value; }
}
