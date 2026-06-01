import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { TreatmentPlanRoutine } from './treatment-plan-routine.entity';
import { TreatmentPlanPeriod, TreatmentPlanStatus } from './treatment-plan.types';

interface TreatmentPlanProps {
  id: string;
  patientId: string;
  name: string;
  status: TreatmentPlanStatus | string;
  period: TreatmentPlanPeriod;
  routines: TreatmentPlanRoutine[];
}

export class TreatmentPlan implements BaseEntity {
  private _id: string;
  private _patientId: string;
  private _name: string;
  private _status: string;
  private _period: TreatmentPlanPeriod;
  private _routines: TreatmentPlanRoutine[];

  constructor(props: TreatmentPlanProps) {
    this._id = props.id;
    this._patientId = props.patientId;
    this._name = props.name;
    this._status = props.status;
    this._period = props.period;
    this._routines = props.routines;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get patientId(): string { return this._patientId; }
  set patientId(value: string) { this._patientId = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get period(): TreatmentPlanPeriod { return this._period; }
  set period(value: TreatmentPlanPeriod) { this._period = value; }

  get routines(): TreatmentPlanRoutine[] { return this._routines; }
  set routines(value: TreatmentPlanRoutine[]) { this._routines = value; }
}
