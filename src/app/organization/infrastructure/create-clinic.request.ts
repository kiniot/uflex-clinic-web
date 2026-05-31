export interface ClinicAddressRequest {
  countryCode: string;
  region: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode?: string | null;
}

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
  address: ClinicAddressRequest;
}
