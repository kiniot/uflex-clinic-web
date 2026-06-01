import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateRoutineCommand } from '../domain/model/update-routine.command';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const treatmentPlansApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTreatmentPlansEndpointPath,
);

export class UpdateRoutineApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  updateRoutine(
    treatmentPlanId: string,
    routineOrder: number,
    command: UpdateRoutineCommand,
  ): Observable<TreatmentPlanResource> {
    const request = this.assembler.toRequestFromUpdateRoutineCommand(command);
    return this.http
      .put<TreatmentPlanResponse>(
        `${treatmentPlansApiEndpointUrl}/${treatmentPlanId}/routines/${routineOrder}`,
        request,
      )
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to update treatment plan routine')),
      );
  }
}
