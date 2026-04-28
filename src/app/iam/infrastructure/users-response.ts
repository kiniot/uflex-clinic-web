import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource interface for user data in the infrastructure layer of the IAM bounded context.
 */
export interface UserResource extends BaseResource {
  id: number;
  username: string;
}

/**
 * Response interface for users API calls in the infrastructure layer of the IAM bounded context.
 */
export interface UsersResponse extends BaseResponse {
  courses: UserResource[];
}
