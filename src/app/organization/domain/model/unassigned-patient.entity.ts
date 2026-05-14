import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {CareTag} from './unassigned-patient.types';

interface UnassignedPatientProps {
  id: string;
  name: string;
  condition: string;
  arrivedLabel: string;
  tags: CareTag[];
}

export class UnassignedPatient implements BaseEntity {
  private _id: string;
  private _name: string;
  private _condition: string;
  private _arrivedLabel: string;
  private _tags: CareTag[];

  constructor(props: UnassignedPatientProps) {
    this._id = props.id;
    this._name = props.name;
    this._condition = props.condition;
    this._arrivedLabel = props.arrivedLabel;
    this._tags = props.tags;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get condition(): string { return this._condition; }
  set condition(value: string) { this._condition = value; }

  get arrivedLabel(): string { return this._arrivedLabel; }
  set arrivedLabel(value: string) { this._arrivedLabel = value; }

  get tags(): CareTag[] { return this._tags; }
  set tags(value: CareTag[]) { this._tags = value; }
}