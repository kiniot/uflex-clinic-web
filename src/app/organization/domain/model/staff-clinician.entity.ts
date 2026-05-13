import {BaseEntity} from '../../../shared/domain/model/base-entity';

interface StaffClinicianProps {
  id: number;
  name: string;
  email: string;
  specialization: string;
  caseloadCurrent: number;
  caseloadMax: number;
  avatarInitials: string;
}

/**
 * Read projection of a clinician for the physiotherapist's Staff
 * Directory. Carries identity plus their named specialization and
 * caseload usage (current/max), which is what the directory table
 * surfaces. Distinct from the broader TeamMember entity used by the
 * clinic admin view.
 */
export class StaffClinician implements BaseEntity {
  private _id: number;
  private _name: string;
  private _email: string;
  private _specialization: string;
  private _caseloadCurrent: number;
  private _caseloadMax: number;
  private _avatarInitials: string;

  constructor(props: StaffClinicianProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._specialization = props.specialization;
    this._caseloadCurrent = props.caseloadCurrent;
    this._caseloadMax = props.caseloadMax;
    this._avatarInitials = props.avatarInitials;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get specialization(): string { return this._specialization; }
  set specialization(value: string) { this._specialization = value; }

  get caseloadCurrent(): number { return this._caseloadCurrent; }
  set caseloadCurrent(value: number) { this._caseloadCurrent = value; }

  get caseloadMax(): number { return this._caseloadMax; }
  set caseloadMax(value: number) { this._caseloadMax = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }
}
