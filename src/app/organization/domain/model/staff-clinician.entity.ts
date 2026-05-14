import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Specialty} from './team-member.types';

export class StaffClinician implements BaseEntity {
  private _id: string;
  private _fullName: string;
  private _email: string;
  private _specialty: Specialty;
  private _caseloadCurrent: number;
  private _caseloadMax: number;
  private _avatarInitials: string;

  constructor(data: {
    id: string;
    fullName: string;
    email: string;
    specialty: Specialty;
    caseloadCurrent: number;
    caseloadMax?: number;
  }) {
    this._id = data.id;
    this._fullName = data.fullName;
    this._email = data.email;
    this._specialty = data.specialty;
    this._caseloadCurrent = data.caseloadCurrent;
    this._caseloadMax = data.caseloadMax ?? 20;
    this._avatarInitials = this.computeInitials(data.fullName);
  }

  private computeInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get specialty(): Specialty { return this._specialty; }
  set specialty(value: Specialty) { this._specialty = value; }

  get caseloadCurrent(): number { return this._caseloadCurrent; }
  set caseloadCurrent(value: number) { this._caseloadCurrent = value; }

  get caseloadMax(): number { return this._caseloadMax; }
  set caseloadMax(value: number) { this._caseloadMax = value; }

  get avatarInitials(): string { return this._avatarInitials; }
}