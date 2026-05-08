import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {CareTag} from './unassigned-patient.types';

interface UnassignedPatientProps {
  id: number;
  name: string;
  condition: string;
  arrivedLabel: string;
  tags: CareTag[];
}

/**
 * Patient queued for physiotherapist assignment. Modeled in the
 * Organization bounded context because the queue is an
 * organization-wide allocation concern (not part of any individual
 * clinician's caseload yet).
 */
export class UnassignedPatient implements BaseEntity {
  private _id: number;
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

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get condition(): string { return this._condition; }
  set condition(value: string) { this._condition = value; }

  get arrivedLabel(): string { return this._arrivedLabel; }
  set arrivedLabel(value: string) { this._arrivedLabel = value; }

  get tags(): CareTag[] { return this._tags; }
  set tags(value: CareTag[]) { this._tags = value; }
}
