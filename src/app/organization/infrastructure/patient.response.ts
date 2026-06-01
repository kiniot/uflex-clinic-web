import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PatientResource extends BaseResource {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition: string;
  assignedPhysiotherapistId: string | null;
  status: string;
  clinicId: string;
}

export interface PatientResponse extends BaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition: string;
  assignedPhysiotherapistId: string | null;
  status: string;
  clinicId: string;
}
