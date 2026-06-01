import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const treatmentPlansApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTreatmentPlansEndpointPath,
);

export class CompleteTreatmentPlanApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  completeTreatmentPlan(id: string): Observable<TreatmentPlanResource> {
    return this.http.post<TreatmentPlanResponse>(`${treatmentPlansApiEndpointUrl}/${id}/complete`, {}).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to complete treatment plan')),
    );
  }
}
