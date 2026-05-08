import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PatientStatus} from './patient.types';

/**
 * Patient entity in the Planning bounded context. Represents a person
 * being treated whose rehab program a clinician plans (devices, exercise
 * prescriptions, milestones).
 */
export class Patient implements BaseEntity {
  private _id: number;
  private _name: string;
  private _mrn: string;
  private _condition: string;
  private _status: PatientStatus;
  private _avatarInitials: string;

  constructor(data: {
    id: number;
    name: string;
    mrn: string;
    condition: string;
    status: PatientStatus;
    avatarInitials: string;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._mrn = data.mrn;
    this._condition = data.condition;
    this._status = data.status;
    this._avatarInitials = data.avatarInitials;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get mrn(): string { return this._mrn; }
  set mrn(value: string) { this._mrn = value; }

  get condition(): string { return this._condition; }
  set condition(value: string) { this._condition = value; }

  get status(): PatientStatus { return this._status; }
  set status(value: PatientStatus) { this._status = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }
}
