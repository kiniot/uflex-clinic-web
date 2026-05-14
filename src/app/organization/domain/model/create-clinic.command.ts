/**
 * Command capturing the user's intent to create a clinic during the
 * onboarding flow.
 */
export class CreateClinicCommand {
  private _legalName: string;
  private _commercialName: string;
  private _ruc: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;

  constructor(data: {
    legalName: string;
    commercialName: string;
    ruc: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
  }) {
    this._legalName = data.legalName;
    this._commercialName = data.commercialName;
    this._ruc = data.ruc;
    this._email = data.email;
    this._countryCode = data.countryCode;
    this._phoneNumber = data.phoneNumber;
  }

  get legalName(): string {
    return this._legalName;
  }

  get commercialName(): string {
    return this._commercialName;
  }

  get ruc(): string {
    return this._ruc;
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
}
