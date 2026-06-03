import { PatientGender } from './patient.types';

export class UpdatePatientByClinicAdminCommand {
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _birthDate: string;
  private _gender: PatientGender | string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _medicalCondition: string;
  private _assignedPhysiotherapistId: string | null;

  constructor(resource: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender: PatientGender | string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition: string;
    assignedPhysiotherapistId: string | null;
  }) {
    this._firstName = resource.firstName;
    this._lastName = resource.lastName;
    this._dni = resource.dni;
    this._birthDate = resource.birthDate;
    this._gender = resource.gender;
    this._email = resource.email;
    this._countryCode = resource.countryCode;
    this._phoneNumber = resource.phoneNumber;
    this._medicalCondition = resource.medicalCondition;
    this._assignedPhysiotherapistId = resource.assignedPhysiotherapistId;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get dni(): string {
    return this._dni;
  }

  get birthDate(): string {
    return this._birthDate;
  }

  get gender(): string {
    return this._gender;
  }

  get email(): string {
    return this._email;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get medicalCondition(): string {
    return this._medicalCondition;
  }

  get assignedPhysiotherapistId(): string | null {
    return this._assignedPhysiotherapistId;
  }
}
