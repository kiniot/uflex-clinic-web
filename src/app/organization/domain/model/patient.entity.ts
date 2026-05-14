import {BaseEntity} from '../../../shared/domain/model/base-entity';

export type PatientStatus = 'UNASSIGNED' | 'IN_TREATMENT' | 'COMPLETED' | 'DISCHARGED' | 'INACTIVE';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export class Patient implements BaseEntity {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _birthDate: string;
  private _gender: Gender;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _medicalCondition?: string;
  private _assignedPhysiotherapistId?: string;
  private _treatmentPlanId?: string;
  private _status: PatientStatus;
  private _clinicId: string;

  constructor(data: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender: Gender;
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition?: string;
    assignedPhysiotherapistId?: string;
    treatmentPlanId?: string;
    status: PatientStatus;
    clinicId: string;
  }) {
    this._id = data.id;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._dni = data.dni;
    this._birthDate = data.birthDate;
    this._gender = data.gender;
    this._email = data.email;
    this._countryCode = data.countryCode;
    this._phoneNumber = data.phoneNumber;
    this._medicalCondition = data.medicalCondition;
    this._assignedPhysiotherapistId = data.assignedPhysiotherapistId;
    this._treatmentPlanId = data.treatmentPlanId;
    this._status = data.status;
    this._clinicId = data.clinicId;
  }

  get id(): string { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get dni(): string { return this._dni; }
  get birthDate(): string { return this._birthDate; }
  get gender(): Gender { return this._gender; }
  get email(): string { return this._email; }
  get countryCode(): string { return this._countryCode; }
  get phoneNumber(): string { return this._phoneNumber; }
  get medicalCondition(): string | undefined { return this._medicalCondition; }
  get assignedPhysiotherapistId(): string | undefined { return this._assignedPhysiotherapistId; }
  get treatmentPlanId(): string | undefined { return this._treatmentPlanId; }
  get status(): PatientStatus { return this._status; }
  get clinicId(): string { return this._clinicId; }
}