import { SignUpRequest } from './sign-up.request';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpResource, SignUpResponse } from './sign-up-response';

const ROLE_NAME_TO_BACKEND: Record<string, string> = {
  physiotherapist: 'ROLE_PHYSIOTHERAPIST',
  clinicAdmin: 'ROLE_CLINIC_ADMIN',
  patient: 'ROLE_PATIENT',
  user: 'ROLE_USER'
};

export class SignUpAssembler {
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      email: response.email,
      roles: response.roles,
      tenantId: response.tenantId ?? null
    } as SignUpResource;
  }

  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      email: command.email,
      password: command.password,
      roles: command.roles.map((r) => ROLE_NAME_TO_BACKEND[r] ?? r)
    } as SignUpRequest;
  }
}
