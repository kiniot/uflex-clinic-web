export interface PhysiotherapistRequest {
  fullName: string;
  specialty: 'TRAUMATOLOGICAL' | 'NEUROLOGICAL' | 'SPORTS' | 'GENERAL';
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary?: string;
  photoUrl?: string;
  yearsOfExperience: number;
}