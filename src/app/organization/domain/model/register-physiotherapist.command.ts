export class RegisterPhysiotherapistCommand {
  private _fullName: string;
  private _specialty: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _licenseNumber: string;
  private _professionalSummary: string;
  private _photoUrl: string | null;
  private _yearsOfExperience: number;

  constructor(data: {
    fullName: string;
    specialty: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    licenseNumber: string;
    professionalSummary: string;
    photoUrl: string | null;
    yearsOfExperience: number;
  }) {
    this._fullName = data.fullName;
    this._specialty = data.specialty;
    this._email = data.email;
    this._countryCode = data.countryCode;
    this._phoneNumber = data.phoneNumber;
    this._licenseNumber = data.licenseNumber;
    this._professionalSummary = data.professionalSummary;
    this._photoUrl = data.photoUrl;
    this._yearsOfExperience = data.yearsOfExperience;
  }

  get fullName(): string { return this._fullName; }
  get specialty(): string { return this._specialty; }
  get email(): string { return this._email; }
  get countryCode(): string { return this._countryCode; }
  get phoneNumber(): string { return this._phoneNumber; }
  get licenseNumber(): string { return this._licenseNumber; }
  get professionalSummary(): string { return this._professionalSummary; }
  get photoUrl(): string | null { return this._photoUrl; }
  get yearsOfExperience(): number { return this._yearsOfExperience; }
}