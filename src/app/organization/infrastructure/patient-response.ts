import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface PatientResponse extends BaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition?: string;
  assignedPhysiotherapistId?: string;
  treatmentPlanId?: string;
  status: 'UNASSIGNED' | 'IN_TREATMENT' | 'COMPLETED' | 'DISCHARGED' | 'INACTIVE';
  clinicId: string;
}

export interface PatientResource extends BaseResource {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition?: string;
  assignedPhysiotherapistId?: string;
  treatmentPlanId?: string;
  status: 'UNASSIGNED' | 'IN_TREATMENT' | 'COMPLETED' | 'DISCHARGED' | 'INACTIVE';
  clinicId: string;
}