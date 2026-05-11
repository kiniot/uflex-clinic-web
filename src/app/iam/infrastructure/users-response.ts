import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource interface for user data, mirroring the backend `UserResource`.
 */
export interface UserResource extends BaseResource {
  id: string;
  email: string;
  roles: string[];
  tenantId: string | null;
}

/**
 * Response interface for users API calls.
 */
export interface UsersResponse extends BaseResponse {
  users: UserResource[];
}
