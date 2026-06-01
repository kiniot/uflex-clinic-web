import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ClinicAddressResource {
  countryCode: string;
  region: string;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string | null;
}

export interface ClinicProfileResource extends BaseResource {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: ClinicAddressResource;
}

export interface ClinicProfileResponse extends BaseResponse {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: ClinicAddressResource;
}
