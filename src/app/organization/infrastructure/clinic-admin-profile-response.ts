import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ClinicAdminProfileResource extends BaseResource {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  clinicId: string;
}

export interface ClinicAdminProfileResponse extends BaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  clinicId: string;
}
