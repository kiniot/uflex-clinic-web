import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource interface for sign-up operations in the infrastructure layer of the IAM bounded context.
 * Represents the data returned after a successful sign-up.
 */
export interface SignUpResource extends BaseResource {
  id: number;
  username: string;
}

/**
 * Response interface for sign-up API calls in the infrastructure layer of the IAM bounded context.
 * Extends BaseResponse and SignUpResource.
 */
export interface SignUpResponse extends BaseResponse, SignUpResource {}
