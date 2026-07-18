import { HttpClient, HttpParams } from '@angular/common/http';
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

/** Optional filters forwarded as query params to `GET /treatment-plans`. */
export interface TreatmentPlanFilters {
  patientId?: string;
  physiotherapistId?: string;
  status?: string;
}

/**
 * Clinic-wide treatment plan listing. Backs the Planning hub, where a
 * physiotherapist sees every plan across their caseload in one table.
 */
export class TreatmentPlansApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TreatmentPlanAssembler,
  ) {
    super();
  }

  getAllTreatmentPlans(filters?: TreatmentPlanFilters): Observable<TreatmentPlanResource[]> {
    let params = new HttpParams();
    if (filters?.patientId) params = params.set('patientId', filters.patientId);
    if (filters?.physiotherapistId) {
      params = params.set('physiotherapistId', filters.physiotherapistId);
    }
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<TreatmentPlanResponse[]>(treatmentPlansApiEndpointUrl, { params }).pipe(
      map((responses) =>
        responses.map((response) => this.assembler.toResourceFromResponse(response)),
      ),
      catchError(this.handleError('Failed to load treatment plans')),
    );
  }
}
