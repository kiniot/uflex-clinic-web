import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const deletePhysiotherapistApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderDeletePhysiotherapistEndpointPath,
);

export class DeletePhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  deletePhysiotherapist(id: string): Observable<void> {
    return this.http
      .delete<void>(`${deletePhysiotherapistApiEndpointUrl}/${id}`)
      .pipe(catchError(this.handleError('Failed to delete physiotherapist')));
  }
}
