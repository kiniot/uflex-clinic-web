import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ClinicAdminProfileAssembler } from './clinic-admin-profile-assembler';
import {
  ClinicAdminProfileResource,
  ClinicAdminProfileResponse,
} from './clinic-admin-profile-response';

const currentClinicAdminApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderCurrentClinicAdminEndpointPath,
);

export class CurrentClinicAdminApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ClinicAdminProfileAssembler,
  ) {
    super();
  }

  getCurrentClinicAdmin(): Observable<ClinicAdminProfileResource> {
    return this.http.get<ClinicAdminProfileResponse>(currentClinicAdminApiEndpointUrl).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to load current clinic admin')),
    );
  }
}
