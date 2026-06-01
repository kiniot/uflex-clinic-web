import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { AddRoutineCommand } from '../domain/model/add-routine.command';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const treatmentPlansApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTreatmentPlansEndpointPath,
);

export class AddRoutineApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  addRoutine(treatmentPlanId: string, command: AddRoutineCommand): Observable<TreatmentPlanResource> {
    const request = this.assembler.toRequestFromAddRoutineCommand(command);
    return this.http
      .post<TreatmentPlanResponse>(`${treatmentPlansApiEndpointUrl}/${treatmentPlanId}/routines`, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to add treatment plan routine')),
      );
  }
}
