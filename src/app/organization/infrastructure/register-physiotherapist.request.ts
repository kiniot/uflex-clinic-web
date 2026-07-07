export interface RegisterPhysiotherapistRequest {
  fullName: string;
  specialty: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary: string;
  photoAssetId?: string | null;
  yearsOfExperience: number;
}
