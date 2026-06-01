import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const patientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPatientsEndpointPath,
);

export class DischargePatientApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  dischargePatient(id: string): Observable<void> {
    return this.http.put<void>(`${patientsApiEndpointUrl}/${id}/discharge`, {}).pipe(
      catchError(this.handleError('Failed to discharge patient')),
    );
  }
}
