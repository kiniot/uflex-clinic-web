import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ClinicProfileAssembler } from './clinic-profile-assembler';
import { ClinicProfileResource, ClinicProfileResponse } from './clinic-profile-response';

const currentClinicApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderCurrentClinicEndpointPath,
);

export class CurrentClinicApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ClinicProfileAssembler,
  ) {
    super();
  }

  getCurrentClinic(): Observable<ClinicProfileResource> {
    return this.http.get<ClinicProfileResponse>(currentClinicApiEndpointUrl).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to load current clinic')),
    );
  }
}
