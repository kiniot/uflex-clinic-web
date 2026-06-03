import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const reactivatePhysiotherapistApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderReactivatePhysiotherapistEndpointPath,
);

export class ReactivatePhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  reactivatePhysiotherapist(id: string): Observable<void> {
    return this.http
      .post<void>(`${reactivatePhysiotherapistApiEndpointUrl}/${id}/reactivate`, {})
      .pipe(catchError(this.handleError('Failed to reactivate physiotherapist')));
  }
}
