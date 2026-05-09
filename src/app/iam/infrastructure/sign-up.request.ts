/**
 * Request payload for the backend `POST /api/v1/authentication/sign-up` endpoint.
 * Field names must match the backend `SignUpResource` record exactly.
 */
export interface SignUpRequest {
  email: string;
  password: string;
  roles: string[];
}
