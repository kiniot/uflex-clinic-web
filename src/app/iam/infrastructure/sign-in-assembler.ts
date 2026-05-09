import { SignInResource, SignInResponse } from './sign-in-response';
import { SignInRequest } from './sign-in.request';
import { SignInCommand } from '../domain/model/sign-in.command';

export class SignInAssembler {
  toResourceFromResponse(response: SignInResponse): SignInResource {
    return {
      id: response.id,
      email: response.email,
      roles: response.roles ?? [],
      token: response.token
    } as SignInResource;
  }

  toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      email: command.email,
      password: command.password
    } as SignInRequest;
  }
}
