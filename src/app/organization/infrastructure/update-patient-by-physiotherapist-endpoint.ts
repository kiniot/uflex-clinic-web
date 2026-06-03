import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdatePatientContactCommand } from '../domain/model/update-patient-contact.command';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const updatePatientByPhysiotherapistEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderUpdatePatientByPhysiotherapistEndpointPath,
);

export class UpdatePatientByPhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  updatePatient(id: string, command: UpdatePatientContactCommand): Observable<PatientResource> {
    const request = this.assembler.toUpdatePatientByPhysiotherapistRequestFromCommand(command);
    return this.http
      .put<PatientResponse>(`${updatePatientByPhysiotherapistEndpointUrl}/${id}`, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to update patient')),
      );
  }
}
