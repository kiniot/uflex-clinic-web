import { ExerciseSeriesItem, RoutineSchedule } from './treatment-plan.types';

export class AddRoutineCommand {
  private _name: string;
  private _order: number;
  private _schedule: RoutineSchedule;
  private _exerciseSeries: ExerciseSeriesItem[];

  constructor(resource: {
    name: string;
    order: number;
    schedule: RoutineSchedule;
    exerciseSeries: ExerciseSeriesItem[];
  }) {
    this._name = resource.name;
    this._order = resource.order;
    this._schedule = resource.schedule;
    this._exerciseSeries = resource.exerciseSeries;
  }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get order(): number { return this._order; }
  set order(value: number) { this._order = value; }

  get schedule(): RoutineSchedule { return this._schedule; }
  set schedule(value: RoutineSchedule) { this._schedule = value; }

  get exerciseSeries(): ExerciseSeriesItem[] { return this._exerciseSeries; }
  set exerciseSeries(value: ExerciseSeriesItem[]) { this._exerciseSeries = value; }
}
