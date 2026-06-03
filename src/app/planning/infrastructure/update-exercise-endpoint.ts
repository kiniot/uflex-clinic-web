import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateExerciseCommand } from '../domain/model/update-exercise.command';
import { ExerciseCatalogItemAssembler } from './exercise-catalog-item-assembler';
import {
  ExerciseCatalogItemResource,
  ExerciseCatalogItemResponse,
} from './exercise-catalog-item.response';

const exercisesApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderExercisesEndpointPath,
);

export class UpdateExerciseApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ExerciseCatalogItemAssembler,
  ) {
    super();
  }

  updateExercise(
    id: string,
    command: UpdateExerciseCommand,
  ): Observable<ExerciseCatalogItemResource> {
    const request = this.assembler.toRequestFromUpdateCommand(command);
    return this.http
      .put<ExerciseCatalogItemResponse>(`${exercisesApiEndpointUrl}/${id}`, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to update exercise')),
      );
  }
}
