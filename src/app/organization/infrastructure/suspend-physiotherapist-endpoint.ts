import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const suspendPhysiotherapistApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderSuspendPhysiotherapistEndpointPath,
);

export class SuspendPhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  suspendPhysiotherapist(id: string): Observable<void> {
    return this.http
      .post<void>(`${suspendPhysiotherapistApiEndpointUrl}/${id}/suspend`, {})
      .pipe(catchError(this.handleError('Failed to suspend physiotherapist')));
  }
}
