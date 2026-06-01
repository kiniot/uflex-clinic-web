import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const patientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPatientsEndpointPath,
);

export class TreatmentPlanByPatientAndIdApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  getTreatmentPlan(patientId: string, treatmentPlanId: string): Observable<TreatmentPlanResource> {
    return this.http
      .get<TreatmentPlanResponse>(
        `${patientsApiEndpointUrl}/${patientId}/treatment-plans/${treatmentPlanId}`,
      )
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to load treatment plan')),
      );
  }
}
