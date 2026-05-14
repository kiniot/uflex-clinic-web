import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PhysiotherapistStatus, Specialty} from './team-member.types';

export class TeamMember implements BaseEntity {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _fullName: string;
  private _email: string;
  private _specialty: Specialty;
  private _status: PhysiotherapistStatus;
  private _phoneNumber: string;
  private _countryCode: string;
  private _licenseNumber: string;
  private _professionalSummary?: string;
  private _photoUrl?: string;
  private _yearsOfExperience: number;
  private _hireDate: string;
  private _activePatients: number;

  constructor(data: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    specialty: Specialty;
    status: PhysiotherapistStatus;
    phoneNumber: string;
    countryCode: string;
    licenseNumber: string;
    professionalSummary?: string;
    photoUrl?: string;
    yearsOfExperience: number;
    hireDate: string;
    activePatients: number;
  }) {
    this._id = data.id;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._fullName = data.fullName;
    this._email = data.email;
    this._specialty = data.specialty;
    this._status = data.status;
    this._phoneNumber = data.phoneNumber;
    this._countryCode = data.countryCode;
    this._licenseNumber = data.licenseNumber;
    this._professionalSummary = data.professionalSummary;
    this._photoUrl = data.photoUrl;
    this._yearsOfExperience = data.yearsOfExperience;
    this._hireDate = data.hireDate;
    this._activePatients = data.activePatients;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }

  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get specialty(): Specialty { return this._specialty; }
  set specialty(value: Specialty) { this._specialty = value; }

  get status(): PhysiotherapistStatus { return this._status; }
  set status(value: PhysiotherapistStatus) { this._status = value; }

  get phoneNumber(): string { return this._phoneNumber; }
  set phoneNumber(value: string) { this._phoneNumber = value; }

  get countryCode(): string { return this._countryCode; }
  set countryCode(value: string) { this._countryCode = value; }

  get licenseNumber(): string { return this._licenseNumber; }
  set licenseNumber(value: string) { this._licenseNumber = value; }

  get professionalSummary(): string | undefined { return this._professionalSummary; }
  set professionalSummary(value: string | undefined) { this._professionalSummary = value; }

  get photoUrl(): string | undefined { return this._photoUrl; }
  set photoUrl(value: string | undefined) { this._photoUrl = value; }

  get yearsOfExperience(): number { return this._yearsOfExperience; }
  set yearsOfExperience(value: number) { this._yearsOfExperience = value; }

  get hireDate(): string { return this._hireDate; }
  set hireDate(value: string) { this._hireDate = value; }

  get activePatients(): number { return this._activePatients; }
  set activePatients(value: number) { this._activePatients = value; }

  get avatarInitials(): string {
    const parts = this._fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}