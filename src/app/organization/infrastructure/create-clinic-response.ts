import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}
