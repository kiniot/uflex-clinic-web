/**
 * Request interface for sign-up API calls in the infrastructure layer of the IAM bounded context.
 * Contains the necessary data to register a new user.
 */
export interface SignUpRequest{
  username: string;
  password: string;
}
