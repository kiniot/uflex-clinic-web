/**
 * Request interface for sign-in API calls in the infrastructure layer of the IAM bounded context.
 * Contains the credentials needed to authenticate a user.
 */
export interface SignInRequest {
  username: string;
  password: string;
}
