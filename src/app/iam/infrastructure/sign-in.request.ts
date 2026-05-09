/**
 * Request payload for `POST /api/v1/authentication/sign-in`.
 * Field names must match the backend `SignInResource` record exactly.
 */
export interface SignInRequest {
  email: string;
  password: string;
}
