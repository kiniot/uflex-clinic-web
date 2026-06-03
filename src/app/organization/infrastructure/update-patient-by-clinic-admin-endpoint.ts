import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdatePatientByClinicAdminCommand } from '../domain/model/update-patient-by-clinic-admin.command';
import { PatientAssembler } from './patient-assembler';
import { PatientResource, PatientResponse } from './patient.response';

const updatePatientByClinicAdminEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderUpdatePatientByClinicAdminEndpointPath,
);

export class UpdatePatientByClinicAdminApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PatientAssembler,
  ) {
    super();
  }

  updatePatient(id: string, command: UpdatePatientByClinicAdminCommand): Observable<PatientResource> {
    const request = this.assembler.toUpdatePatientByClinicAdminRequestFromCommand(command);
    return this.http.put<PatientResponse>(`${updatePatientByClinicAdminEndpointUrl}/${id}`, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to update patient as clinic admin')),
    );
  }
}
