import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ExerciseCatalogItemAssembler } from './exercise-catalog-item-assembler';
import {
  ExerciseCatalogItemResource,
  ExerciseCatalogItemResponse,
} from './exercise-catalog-item.response';

const exercisesApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderExercisesEndpointPath,
);

export class ExercisesApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ExerciseCatalogItemAssembler,
  ) {
    super();
  }

  getExercises(): Observable<ExerciseCatalogItemResource[]> {
    return this.http.get<ExerciseCatalogItemResponse[]>(exercisesApiEndpointUrl).pipe(
      map((responses) =>
        responses.map((response) => this.assembler.toResourceFromResponse(response)),
      ),
      catchError(this.handleError('Failed to load exercises')),
    );
  }
}
