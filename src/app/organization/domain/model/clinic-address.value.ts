/**
 * Value object representing the clinic address captured during
 * onboarding and sent to the Organization backend contract.
 */
export class ClinicAddressValue {
  private _countryCode: string;
  private _region: string;
  private _city: string;
  private _addressLine1: string;
  private _addressLine2: string | null;
  private _postalCode: string | null;

  constructor(data: {
    countryCode: string;
    region: string;
    city: string;
    addressLine1: string;
    addressLine2?: string | null;
    postalCode?: string | null;
  }) {
    this._countryCode = data.countryCode;
    this._region = data.region;
    this._city = data.city;
    this._addressLine1 = data.addressLine1;
    this._addressLine2 = data.addressLine2 ?? null;
    this._postalCode = data.postalCode ?? null;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get region(): string {
    return this._region;
  }

  get city(): string {
    return this._city;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string | null {
    return this._addressLine2;
  }

  get postalCode(): string | null {
    return this._postalCode;
  }
}
