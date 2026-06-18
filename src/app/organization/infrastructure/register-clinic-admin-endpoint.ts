import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterClinicAdminCommand } from '../domain/model/register-clinic-admin.command';
import { ClinicAdminProfileAssembler } from './clinic-admin-profile-assembler';
import {
  ClinicAdminProfileResource,
  ClinicAdminProfileResponse,
} from './clinic-admin-profile-response';

const registerClinicAdminApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderRegisterClinicAdminEndpointPath,
);

export class RegisterClinicAdminApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ClinicAdminProfileAssembler,
  ) {
    super();
  }

  registerClinicAdmin(
    command: RegisterClinicAdminCommand,
  ): Observable<ClinicAdminProfileResource> {
    const request = this.assembler.toRegisterRequestFromCommand(command);
    return this.http
      .post<ClinicAdminProfileResponse>(registerClinicAdminApiEndpointUrl, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to register clinic admin')),
      );
  }
}
