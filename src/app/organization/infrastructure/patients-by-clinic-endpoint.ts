import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const patientsByClinicApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPatientsByClinicEndpointPath,
);

export class PatientsByClinicApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  getPatientsByClinicId(clinicId: string): Observable<PatientResource[]> {
    return this.http.get<PatientResponse[]>(`${patientsByClinicApiEndpointUrl}/${clinicId}`).pipe(
      map((responses) =>
        responses.map((response) => this.assembler.toResourceFromResponse(response)),
      ),
      catchError(this.handleError('Failed to load patients by clinic')),
    );
  }
}
