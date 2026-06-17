import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const patientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPatientsEndpointPath,
);

export class PatientByIdApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  getPatientById(id: string): Observable<PatientResource> {
    return this.http.get<PatientResponse>(`${patientsApiEndpointUrl}/${id}`).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to load patient')),
    );
  }
}
