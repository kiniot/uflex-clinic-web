import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const patientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderDeletePatientEndpointPath,
);

export class DeletePatientApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  deletePatient(id: string): Observable<void> {
    return this.http
      .delete<void>(`${patientsApiEndpointUrl}/${id}`)
      .pipe(catchError(this.handleError('Failed to delete patient')));
  }
}
