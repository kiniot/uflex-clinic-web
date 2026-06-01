import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const registerPatientApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderRegisterPatientByPhysiotherapistEndpointPath,
);

export class RegisterPatientApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  registerPatient(command: RegisterPatientCommand): Observable<PatientResource> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.post<PatientResponse>(registerPatientApiEndpointUrl, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to register patient')),
    );
  }
}
