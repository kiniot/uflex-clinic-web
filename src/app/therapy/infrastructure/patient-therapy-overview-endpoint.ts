import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  PatientTherapyOverviewResource,
  PatientTherapyOverviewResponse,
} from './therapy-session.response';

const physiotherapistsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPhysiotherapistsEndpointPath,
);

/** Therapy standing of every patient assigned to the signed-in physiotherapist, in one request. */
export class PatientTherapyOverviewApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  getOverview(): Observable<PatientTherapyOverviewResource[]> {
    return this.http
      .get<
        PatientTherapyOverviewResponse[]
      >(`${physiotherapistsApiEndpointUrl}/me/patients/therapy-overview`)
      .pipe(
        map((responses) =>
          responses.map((response) =>
            this.assembler.toPatientTherapyOverviewResourceFromResponse(response),
          ),
        ),
        catchError(this.handleError('Failed to load patient therapy overview')),
      );
  }
}
