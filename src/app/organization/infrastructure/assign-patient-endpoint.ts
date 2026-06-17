import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { PatientAssembler } from './patient-assembler';

const assignPatientApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderAssignPatientEndpointPath,
);

export class AssignPatientApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  assignPatient(patientId: string, command: AssignPatientCommand): Observable<void> {
    const request = this.assembler.toAssignRequestFromCommand(command);
    return this.http
      .put<void>(`${assignPatientApiEndpointUrl}/${patientId}/assign`, request)
      .pipe(catchError(this.handleError('Failed to assign patient')));
  }
}
