import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {RecoveryPhaseStep, RehabPhaseId} from './rehab-program.types';
import {RoutineExercise} from './routine-exercise.entity';

interface RehabProgramProps {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientCondition: string;
  phases: RecoveryPhaseStep[];
  currentPhase: RehabPhaseId;
  dayNumber: number;
  totalDays: number;
  scheduleLabel: string;
  routineExercises: RoutineExercise[];
}

/**
 * Personalized rehabilitation roadmap for a patient. Owns the patient
 * snapshot, the four-phase progression, the timeline (day X of N), the
 * weekly schedule, and the prescribed routine exercises. Edited by the
 * physiotherapist in the Therapy Roadmap view.
 */
export class RehabProgram implements BaseEntity {
  private _id: number;
  private _patientName: string;
  private _patientAge: number;
  private _patientGender: string;
  private _patientCondition: string;
  private _phases: RecoveryPhaseStep[];
  private _currentPhase: RehabPhaseId;
  private _dayNumber: number;
  private _totalDays: number;
  private _scheduleLabel: string;
  private _routineExercises: RoutineExercise[];

  constructor(props: RehabProgramProps) {
    this._id = props.id;
    this._patientName = props.patientName;
    this._patientAge = props.patientAge;
    this._patientGender = props.patientGender;
    this._patientCondition = props.patientCondition;
    this._phases = props.phases;
    this._currentPhase = props.currentPhase;
    this._dayNumber = props.dayNumber;
    this._totalDays = props.totalDays;
    this._scheduleLabel = props.scheduleLabel;
    this._routineExercises = props.routineExercises;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get patientName(): string { return this._patientName; }
  set patientName(value: string) { this._patientName = value; }

  get patientAge(): number { return this._patientAge; }
  set patientAge(value: number) { this._patientAge = value; }

  get patientGender(): string { return this._patientGender; }
  set patientGender(value: string) { this._patientGender = value; }

  get patientCondition(): string { return this._patientCondition; }
  set patientCondition(value: string) { this._patientCondition = value; }

  get phases(): RecoveryPhaseStep[] { return this._phases; }
  set phases(value: RecoveryPhaseStep[]) { this._phases = value; }

  get currentPhase(): RehabPhaseId { return this._currentPhase; }
  set currentPhase(value: RehabPhaseId) { this._currentPhase = value; }

  get dayNumber(): number { return this._dayNumber; }
  set dayNumber(value: number) { this._dayNumber = value; }

  get totalDays(): number { return this._totalDays; }
  set totalDays(value: number) { this._totalDays = value; }

  get scheduleLabel(): string { return this._scheduleLabel; }
  set scheduleLabel(value: string) { this._scheduleLabel = value; }

  get routineExercises(): RoutineExercise[] { return this._routineExercises; }
  set routineExercises(value: RoutineExercise[]) { this._routineExercises = value; }
}
