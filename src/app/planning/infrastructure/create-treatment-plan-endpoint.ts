import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { CreateTreatmentPlanCommand } from '../domain/model/create-treatment-plan.command';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';

const patientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPatientsEndpointPath,
);

export class CreateTreatmentPlanApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  createTreatmentPlan(
    patientId: string,
    command: CreateTreatmentPlanCommand,
  ): Observable<TreatmentPlanResource> {
    const request = this.assembler.toRequestFromCreateCommand(command);
    return this.http
      .post<TreatmentPlanResponse>(`${patientsApiEndpointUrl}/${patientId}/treatment-plans`, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to create treatment plan')),
      );
  }
}
