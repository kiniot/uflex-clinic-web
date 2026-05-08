import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {ExerciseCategory, ExerciseDifficulty, ExerciseMetric} from './exercise.types';

/**
 * Exercise entity in the Therapy bounded context. Represents a catalog
 * entry that clinicians can prescribe to patients.
 */
export class Exercise implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _category: ExerciseCategory;
  private _difficulty: ExerciseDifficulty;
  private _equipment: string | null;
  private _icon: string;
  private _metrics: ExerciseMetric[];

  constructor(data: {
    id: number;
    name: string;
    description: string;
    category: ExerciseCategory;
    difficulty: ExerciseDifficulty;
    equipment: string | null;
    icon: string;
    metrics: ExerciseMetric[];
  }) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._category = data.category;
    this._difficulty = data.difficulty;
    this._equipment = data.equipment;
    this._icon = data.icon;
    this._metrics = data.metrics;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get category(): ExerciseCategory { return this._category; }
  set category(value: ExerciseCategory) { this._category = value; }

  get difficulty(): ExerciseDifficulty { return this._difficulty; }
  set difficulty(value: ExerciseDifficulty) { this._difficulty = value; }

  get equipment(): string | null { return this._equipment; }
  set equipment(value: string | null) { this._equipment = value; }

  get icon(): string { return this._icon; }
  set icon(value: string) { this._icon = value; }

  get metrics(): ExerciseMetric[] { return this._metrics; }
  set metrics(value: ExerciseMetric[]) { this._metrics = value; }
}
