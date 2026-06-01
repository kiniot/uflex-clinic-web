import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ExerciseSeriesItem, RoutineSchedule } from './treatment-plan.types';

interface TreatmentPlanRoutineProps {
  id: string;
  name: string;
  order: number;
  schedule: RoutineSchedule;
  exerciseSeries: ExerciseSeriesItem[];
}

export class TreatmentPlanRoutine implements BaseEntity {
  private _id: string;
  private _name: string;
  private _order: number;
  private _schedule: RoutineSchedule;
  private _exerciseSeries: ExerciseSeriesItem[];

  constructor(props: TreatmentPlanRoutineProps) {
    this._id = props.id;
    this._name = props.name;
    this._order = props.order;
    this._schedule = props.schedule;
    this._exerciseSeries = props.exerciseSeries;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get order(): number { return this._order; }
  set order(value: number) { this._order = value; }

  get schedule(): RoutineSchedule { return this._schedule; }
  set schedule(value: RoutineSchedule) { this._schedule = value; }

  get exerciseSeries(): ExerciseSeriesItem[] { return this._exerciseSeries; }
  set exerciseSeries(value: ExerciseSeriesItem[]) { this._exerciseSeries = value; }
}
