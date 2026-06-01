import {
  ExerciseSeriesItem,
  RoutineSchedule,
  TreatmentPlanPeriod,
  TreatmentPlanStatus,
} from './treatment-plan.types';

interface CreateTreatmentPlanRoutineCommand {
  name: string;
  order: number;
  schedule: RoutineSchedule;
  exerciseSeries: ExerciseSeriesItem[];
}

export class CreateTreatmentPlanCommand {
  private _name: string;
  private _status: TreatmentPlanStatus | string;
  private _period: TreatmentPlanPeriod;
  private _routines: CreateTreatmentPlanRoutineCommand[];

  constructor(resource: {
    name: string;
    status: TreatmentPlanStatus | string;
    period: TreatmentPlanPeriod;
    routines: CreateTreatmentPlanRoutineCommand[];
  }) {
    this._name = resource.name;
    this._status = resource.status;
    this._period = resource.period;
    this._routines = resource.routines;
  }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get period(): TreatmentPlanPeriod { return this._period; }
  set period(value: TreatmentPlanPeriod) { this._period = value; }

  get routines(): CreateTreatmentPlanRoutineCommand[] { return this._routines; }
  set routines(value: CreateTreatmentPlanRoutineCommand[]) { this._routines = value; }
}
