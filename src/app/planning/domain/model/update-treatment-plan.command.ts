import { TreatmentPlanPeriod } from './treatment-plan.types';

export class UpdateTreatmentPlanCommand {
  private _name: string;
  private _period: TreatmentPlanPeriod;

  constructor(resource: { name: string; period: TreatmentPlanPeriod }) {
    this._name = resource.name;
    this._period = resource.period;
  }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get period(): TreatmentPlanPeriod { return this._period; }
  set period(value: TreatmentPlanPeriod) { this._period = value; }
}
