import {ExerciseBodyPart, ExerciseCategory, ExerciseDifficulty} from './exercise.types';

/**
 * Command capturing the user's intent to register a new exercise in the
 * Therapy catalog. The presentation layer fills it from the registration
 * form; the application layer hands it to the Therapy API endpoint.
 */
export class RegisterExerciseCommand {
  private _name: string;
  private _category: ExerciseCategory;
  private _bodyPart: ExerciseBodyPart;
  private _description: string;
  private _defaultSets: number;
  private _defaultReps: number;
  private _holdDurationSec: number;
  private _difficulty: ExerciseDifficulty;
  private _equipment: string | null;
  private _mediaFileName: string | null;

  constructor(data: {
    name: string;
    category: ExerciseCategory;
    bodyPart: ExerciseBodyPart;
    description: string;
    defaultSets: number;
    defaultReps: number;
    holdDurationSec: number;
    difficulty: ExerciseDifficulty;
    equipment: string | null;
    mediaFileName: string | null;
  }) {
    this._name = data.name;
    this._category = data.category;
    this._bodyPart = data.bodyPart;
    this._description = data.description;
    this._defaultSets = data.defaultSets;
    this._defaultReps = data.defaultReps;
    this._holdDurationSec = data.holdDurationSec;
    this._difficulty = data.difficulty;
    this._equipment = data.equipment;
    this._mediaFileName = data.mediaFileName;
  }

  get name(): string { return this._name; }
  get category(): ExerciseCategory { return this._category; }
  get bodyPart(): ExerciseBodyPart { return this._bodyPart; }
  get description(): string { return this._description; }
  get defaultSets(): number { return this._defaultSets; }
  get defaultReps(): number { return this._defaultReps; }
  get holdDurationSec(): number { return this._holdDurationSec; }
  get difficulty(): ExerciseDifficulty { return this._difficulty; }
  get equipment(): string | null { return this._equipment; }
  get mediaFileName(): string | null { return this._mediaFileName; }
}
