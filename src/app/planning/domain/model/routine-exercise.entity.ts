import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {RoutineParameter} from './rehab-program.types';

interface RoutineExerciseProps {
  id: number;
  name: string;
  description: string;
  parameters: RoutineParameter[];
}

/**
 * A single exercise prescribed inside a patient's daily routine. It
 * carries the clinician's parameters (sets, reps, holds, intensity,
 * etc.) and is what the routine builder lets the physiotherapist
 * tweak per session.
 */
export class RoutineExercise implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _parameters: RoutineParameter[];

  constructor(props: RoutineExerciseProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._parameters = props.parameters;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get parameters(): RoutineParameter[] { return this._parameters; }
  set parameters(value: RoutineParameter[]) { this._parameters = value; }
}
