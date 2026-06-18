export type ClinicAdminGender = 'MALE' | 'FEMALE' | 'OTHER';

interface RegisterClinicAdminCommandProps {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: ClinicAdminGender;
  countryCode: string;
  phoneNumber: string;
}

export class RegisterClinicAdminCommand {
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _birthDate: string;
  private _gender: ClinicAdminGender;
  private _countryCode: string;
  private _phoneNumber: string;

  constructor(props: RegisterClinicAdminCommandProps) {
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._dni = props.dni;
    this._birthDate = props.birthDate;
    this._gender = props.gender;
    this._countryCode = props.countryCode;
    this._phoneNumber = props.phoneNumber;
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

  get gender(): ClinicAdminGender {
    return this._gender;
  }

  set gender(value: ClinicAdminGender) {
    this._gender = value;
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
}
