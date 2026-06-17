import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PhysiotherapistProfileResource extends BaseResource {
  id: string;
  userId: string;
  clinicId: string;
  fullName: string;
  specialty: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary: string | null;
  photoUrl: string | null;
  yearsOfExperience: number;
  hireDate: string;
  status: string;
}

export interface PhysiotherapistProfileResponse extends BaseResponse {
  id: string;
  userId: string;
  clinicId: string;
  fullName: string;
  specialty: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary: string | null;
  photoUrl: string | null;
  yearsOfExperience: number;
  hireDate: string;
  status: string;
}
