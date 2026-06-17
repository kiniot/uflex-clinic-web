export class UpdatePatientContactCommand {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _medicalCondition: string;

  constructor(resource: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition: string;
  }) {
    this._firstName = resource.firstName;
    this._lastName = resource.lastName;
    this._email = resource.email;
    this._countryCode = resource.countryCode;
    this._phoneNumber = resource.phoneNumber;
    this._medicalCondition = resource.medicalCondition;
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
}
