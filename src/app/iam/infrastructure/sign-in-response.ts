import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource returned after a successful sign-in.
 * Mirrors the backend `AuthenticatedUserResource(id, email, roles, token)`.
 */
export interface SignInResource extends BaseResource {
  id: string;
  email: string;
  roles: string[];
  token: string;
}

/**
 * Response interface for sign-in API calls.
 */
export interface SignInResponse extends BaseResponse {
  id: string;
  email: string;
  roles: string[];
  token: string;
}
