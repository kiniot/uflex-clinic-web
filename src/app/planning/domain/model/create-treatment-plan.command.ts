import { ExerciseSeriesItem, RoutineSchedule, TreatmentPlanPeriod } from './treatment-plan.types';

interface CreateTreatmentPlanRoutineCommand {
  name: string;
  order: number;
  schedule: RoutineSchedule;
  exerciseSeries: ExerciseSeriesItem[];
}

export class CreateTreatmentPlanCommand {
  private _name: string;
  private _period: TreatmentPlanPeriod;
  private _routines: CreateTreatmentPlanRoutineCommand[];

  constructor(resource: {
    name: string;
    period: TreatmentPlanPeriod;
    routines: CreateTreatmentPlanRoutineCommand[];
  }) {
    this._name = resource.name;
    this._period = resource.period;
    this._routines = resource.routines;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get period(): TreatmentPlanPeriod {
    return this._period;
  }
  set period(value: TreatmentPlanPeriod) {
    this._period = value;
  }

  get routines(): CreateTreatmentPlanRoutineCommand[] {
    return this._routines;
  }
  set routines(value: CreateTreatmentPlanRoutineCommand[]) {
    this._routines = value;
  }
}
