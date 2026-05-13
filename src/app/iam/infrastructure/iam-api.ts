import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { SignUpAssembler } from './sign-up-assembler';
import { SignInAssembler } from './sign-in-assembler';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { Observable } from 'rxjs';
import { SignUpResource } from './sign-up-response';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignInResource } from './sign-in-response';
import { SignUpApiEndpoint } from './sign-up-endpoint';
import { SignInApiEndpoint } from './sign-in-endpoint';
import { ChangePasswordApiEndpoint } from './change-password-endpoint';
import { ChangePasswordCommand } from '../domain/model/change-password.command';

/**
 * API service for Identity and Access Management operations in the infrastructure layer of the IAM bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly changePasswordEndpoint: ChangePasswordApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.changePasswordEndpoint = new ChangePasswordApiEndpoint(http);
  }

  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    return this.signUpEndpoint.signUp(signUpCommand);
  }

  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    return this.signInEndpoint.signIn(signInCommand);
  }

  changeMyPassword(command: ChangePasswordCommand): Observable<void> {
    return this.changePasswordEndpoint.changePassword(command);
  }
}
