import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export type PhysiotherapistStatus = 'INACTIVE' | 'ACTIVE' | 'SUSPENDED';
export type Specialty = 'TRAUMATOLOGICAL' | 'NEUROLOGICAL' | 'SPORTS' | 'GENERAL';

export interface PhysiotherapistResponse extends BaseResponse {
  id: string;
  userId: string;
  clinicId: string;
  fullName: string;
  specialty: Specialty;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary?: string;
  photoUrl?: string;
  yearsOfExperience: number;
  hireDate: string;
  status: PhysiotherapistStatus;
}

export interface PhysiotherapistResource extends BaseResource {
  id: string;
  userId: string;
  clinicId: string;
  fullName: string;
  specialty: Specialty;
  email: string;
  countryCode: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalSummary?: string;
  photoUrl?: string;
  yearsOfExperience: number;
  hireDate: string;
  status: PhysiotherapistStatus;
}