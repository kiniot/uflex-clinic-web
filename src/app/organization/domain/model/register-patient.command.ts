import { PatientGender } from './patient.types';

export class RegisterPatientCommand {
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
    assignedPhysiotherapistId?: string | null;
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
    this._assignedPhysiotherapistId = resource.assignedPhysiotherapistId ?? null;
  }

  get firstName(): string {
    return this._firstName;
  }
  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }
  set lastName(value: string) {
    this._lastName = value;
  }

  get dni(): string {
    return this._dni;
  }
  set dni(value: string) {
    this._dni = value;
  }

  get birthDate(): string {
    return this._birthDate;
  }
  set birthDate(value: string) {
    this._birthDate = value;
  }

  get gender(): string {
    return this._gender;
  }
  set gender(value: string) {
    this._gender = value;
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

  get medicalCondition(): string {
    return this._medicalCondition;
  }
  set medicalCondition(value: string) {
    this._medicalCondition = value;
  }

  get assignedPhysiotherapistId(): string | null {
    return this._assignedPhysiotherapistId;
  }
  set assignedPhysiotherapistId(value: string | null) {
    this._assignedPhysiotherapistId = value;
  }
}
