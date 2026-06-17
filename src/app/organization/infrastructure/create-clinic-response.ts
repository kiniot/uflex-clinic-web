import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ClinicAddressResource {
  countryCode: string;
  region: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode?: string | null;
}

/**
 * Resource returned after a successful clinic creation.
 */
export interface ClinicResource extends BaseResource {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: ClinicAddressResource;
}

/**
 * Response payload returned by the backend `POST /api/v1/clinics` endpoint.
 */
export interface CreateClinicResponse extends BaseResponse {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: ClinicAddressResource;
}
