import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PlanFeature} from './subscription.types';

/**
 * SubscriptionPlan entity in the Subscription bounded context. Represents
 * a tier the clinic can subscribe to, with its monthly price and the
 * inclusive/excluded features that ship with it.
 */
export class SubscriptionPlan implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _monthlyPrice: number;
  private _features: PlanFeature[];

  constructor(data: {
    id: number;
    name: string;
    description: string;
    monthlyPrice: number;
    features: PlanFeature[];
  }) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._monthlyPrice = data.monthlyPrice;
    this._features = data.features;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get monthlyPrice(): number { return this._monthlyPrice; }
  set monthlyPrice(value: number) { this._monthlyPrice = value; }

  get features(): PlanFeature[] { return this._features; }
  set features(value: PlanFeature[]) { this._features = value; }
}
