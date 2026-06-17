import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const exercisesApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderExercisesEndpointPath,
);

export class DeleteExerciseApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  deleteExercise(id: string): Observable<void> {
    return this.http
      .delete<void>(`${exercisesApiEndpointUrl}/${id}`)
      .pipe(catchError(this.handleError('Failed to delete exercise')));
  }
}
