import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { CreateExerciseCommand } from '../domain/model/create-exercise.command';
import { ExerciseCatalogItemAssembler } from './exercise-catalog-item-assembler';
import {
  ExerciseCatalogItemResource,
  ExerciseCatalogItemResponse,
} from './exercise-catalog-item.response';

const exercisesApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderExercisesEndpointPath,
);

export class CreateExerciseApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ExerciseCatalogItemAssembler,
  ) {
    super();
  }

  createExercise(command: CreateExerciseCommand): Observable<ExerciseCatalogItemResource> {
    const request = this.assembler.toRequestFromCreateCommand(command);
    return this.http.post<ExerciseCatalogItemResponse>(exercisesApiEndpointUrl, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to create exercise')),
    );
  }
}
