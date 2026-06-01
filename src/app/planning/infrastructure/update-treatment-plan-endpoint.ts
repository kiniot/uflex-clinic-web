import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateTreatmentPlanCommand } from '../domain/model/update-treatment-plan.command';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const treatmentPlansApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTreatmentPlansEndpointPath,
);

export class UpdateTreatmentPlanApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  updateTreatmentPlan(id: string, command: UpdateTreatmentPlanCommand): Observable<TreatmentPlanResource> {
    const request = this.assembler.toRequestFromUpdateCommand(command);
    return this.http.put<TreatmentPlanResponse>(`${treatmentPlansApiEndpointUrl}/${id}`, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to update treatment plan')),
    );
  }
}
