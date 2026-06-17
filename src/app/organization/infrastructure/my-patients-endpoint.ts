import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const myPatientsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderMyPatientsEndpointPath,
);

export class MyPatientsApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  getMyPatients(): Observable<PatientResource[]> {
    return this.http.get<PatientResponse[]>(myPatientsApiEndpointUrl).pipe(
      map((responses) => responses.map((response) => this.assembler.toResourceFromResponse(response))),
      catchError(this.handleError('Failed to load physiotherapist patients')),
    );
  }
}
