import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type PhysiotherapistSpecialty = 'TRAUMATOLOGICAL' | 'NEUROLOGICAL' | 'SPORTS' | 'GENERAL';

export type PhysiotherapistEmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface PhysiotherapistProfileProps {
  id: string;
  userId: string;
  clinicId: string;
  fullName: string;
  specialty: PhysiotherapistSpecialty | string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary: string | null;
  photoUrl: string | null;
  yearsOfExperience: number;
  hireDate: string;
  status: PhysiotherapistEmploymentStatus | string;
}

export class PhysiotherapistProfile implements BaseEntity {
  private _id: string;
  private _userId: string;
  private _clinicId: string;
  private _fullName: string;
  private _specialty: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _licenseNumber: string;
  private _professionalSummary: string | null;
  private _photoUrl: string | null;
  private _yearsOfExperience: number;
  private _hireDate: string;
  private _status: string;

  constructor(props: PhysiotherapistProfileProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._clinicId = props.clinicId;
    this._fullName = props.fullName;
    this._specialty = props.specialty;
    this._email = props.email;
    this._countryCode = props.countryCode;
    this._phoneNumber = props.phoneNumber;
    this._licenseNumber = props.licenseNumber;
    this._professionalSummary = props.professionalSummary;
    this._photoUrl = props.photoUrl;
    this._yearsOfExperience = props.yearsOfExperience;
    this._hireDate = props.hireDate;
    this._status = props.status;
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get clinicId(): string {
    return this._clinicId;
  }
  set clinicId(value: string) {
    this._clinicId = value;
  }

  get fullName(): string {
    return this._fullName;
  }
  set fullName(value: string) {
    this._fullName = value;
  }

  get specialty(): string {
    return this._specialty;
  }
  set specialty(value: string) {
    this._specialty = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  get countryCode(): string {
    return this._countryCode;
  }
  set countryCode(value: string) {
    this._countryCode = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }
  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get licenseNumber(): string {
    return this._licenseNumber;
  }
  set licenseNumber(value: string) {
    this._licenseNumber = value;
  }

  get professionalSummary(): string | null {
    return this._professionalSummary;
  }
  set professionalSummary(value: string | null) {
    this._professionalSummary = value;
  }

  get photoUrl(): string | null {
    return this._photoUrl;
  }
  set photoUrl(value: string | null) {
    this._photoUrl = value;
  }

  get yearsOfExperience(): number {
    return this._yearsOfExperience;
  }
  set yearsOfExperience(value: number) {
    this._yearsOfExperience = value;
  }

  get hireDate(): string {
    return this._hireDate;
  }
  set hireDate(value: string) {
    this._hireDate = value;
  }

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }
}
