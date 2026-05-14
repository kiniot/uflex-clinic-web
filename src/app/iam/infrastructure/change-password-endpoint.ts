import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ChangePasswordCommand } from '../domain/model/change-password.command';
import { ChangePasswordRequest } from './change-password.request';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const changePasswordEndpointUrl = buildApiUrl(environment.apiBaseUrl, '/users/me/password');

/**
 * API endpoint for changing the authenticated user's password.
 * Calls `PUT /api/v1/users/me/password` and expects an empty 204 response.
 */
export class ChangePasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  changePassword(command: ChangePasswordCommand): Observable<void> {
    const request: ChangePasswordRequest = {
      currentPassword: command.currentPassword,
      newPassword: command.newPassword,
    };
    return this.http
      .put<void>(changePasswordEndpointUrl, request)
      .pipe(catchError(this.handleError('Failed to change password')));
  }
}
