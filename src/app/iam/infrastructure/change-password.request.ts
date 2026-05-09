/**
 * Request payload for `PUT /api/v1/users/me/password`.
 * Field names must match the backend `ChangePasswordResource` record exactly.
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
