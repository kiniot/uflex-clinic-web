/**
 * Request payload for the backend `POST /api/v1/clinics` endpoint.
 */
export interface CreateClinicRequest {
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
}
