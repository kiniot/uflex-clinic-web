import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource returned after a successful sign-up.
 * Mirrors the backend `UserResource(id, email, roles, tenantId)`.
 */
export interface SignUpResource extends BaseResource {
  id: string;
  email: string;
  roles: string[];
  tenantId: string | null;
}

/**
 * Response interface for sign-up API calls.
 */
export interface SignUpResponse extends BaseResponse {
  id: string;
  email: string;
  roles: string[];
  tenantId: string | null;
}
