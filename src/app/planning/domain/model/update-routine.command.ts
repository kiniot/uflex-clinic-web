import { ExerciseSeriesItem, RoutineSchedule } from './treatment-plan.types';

export class UpdateRoutineCommand {
  private _name: string;
  private _newOrder: number;
  private _schedule: RoutineSchedule;
  private _exerciseSeries: ExerciseSeriesItem[];

  constructor(resource: {
    name: string;
    newOrder: number;
    schedule: RoutineSchedule;
    exerciseSeries: ExerciseSeriesItem[];
  }) {
    this._name = resource.name;
    this._newOrder = resource.newOrder;
    this._schedule = resource.schedule;
    this._exerciseSeries = resource.exerciseSeries;
  }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get newOrder(): number { return this._newOrder; }
  set newOrder(value: number) { this._newOrder = value; }

  get schedule(): RoutineSchedule { return this._schedule; }
  set schedule(value: RoutineSchedule) { this._schedule = value; }

  get exerciseSeries(): ExerciseSeriesItem[] { return this._exerciseSeries; }
  set exerciseSeries(value: ExerciseSeriesItem[]) { this._exerciseSeries = value; }
}
