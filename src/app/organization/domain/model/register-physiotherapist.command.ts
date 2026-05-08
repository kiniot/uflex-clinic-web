/**
 * Command capturing the user's intent to onboard a new physiotherapist
 * to the clinic. Built by the registration view; consumed by the
 * Organization application layer (and eventually the Organization API).
 */
export class RegisterPhysiotherapistCommand {
  private _fullName: string;
  private _specialty: string;
  private _email: string;
  private _phone: string;
  private _licenseNumber: string;
  private _professionalSummary: string;
  private _photoFileName: string | null;

  constructor(data: {
    fullName: string;
    specialty: string;
    email: string;
    phone: string;
    licenseNumber: string;
    professionalSummary: string;
    photoFileName: string | null;
  }) {
    this._fullName = data.fullName;
    this._specialty = data.specialty;
    this._email = data.email;
    this._phone = data.phone;
    this._licenseNumber = data.licenseNumber;
    this._professionalSummary = data.professionalSummary;
    this._photoFileName = data.photoFileName;
  }

  get fullName(): string { return this._fullName; }
  get specialty(): string { return this._specialty; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get licenseNumber(): string { return this._licenseNumber; }
  get professionalSummary(): string { return this._professionalSummary; }
  get photoFileName(): string | null { return this._photoFileName; }
}
