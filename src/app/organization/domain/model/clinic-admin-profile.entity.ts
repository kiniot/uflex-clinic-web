import { BaseEntity } from '../../../shared/domain/model/base-entity';

interface ClinicAdminProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  clinicId: string;
}

export class ClinicAdminProfile implements BaseEntity {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _birthDate: string;
  private _gender: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _clinicId: string;

  constructor(props: ClinicAdminProfileProps) {
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._dni = props.dni;
    this._birthDate = props.birthDate;
    this._gender = props.gender;
    this._email = props.email;
    this._countryCode = props.countryCode;
    this._phoneNumber = props.phoneNumber;
    this._clinicId = props.clinicId;
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
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

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
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

  get clinicId(): string {
    return this._clinicId;
  }
  set clinicId(value: string) {
    this._clinicId = value;
  }
}
