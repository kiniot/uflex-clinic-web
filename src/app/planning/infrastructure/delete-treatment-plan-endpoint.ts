import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const treatmentPlansApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTreatmentPlansEndpointPath,
);

export class DeleteTreatmentPlanApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  deleteTreatmentPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${treatmentPlansApiEndpointUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to delete treatment plan')),
    );
  }
}
