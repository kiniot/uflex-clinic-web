import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { CreateClinicAssembler } from './create-clinic-assembler';
import { ClinicResource, CreateClinicResponse } from './create-clinic-response';

const createClinicApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCreateClinicEndpointPath}`;

/**
 * API endpoint for creating clinics during onboarding.
 */
export class CreateClinicApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: CreateClinicAssembler,
  ) {
    super();
  }

  createClinic(command: CreateClinicCommand): Observable<ClinicResource> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.post<CreateClinicResponse>(createClinicApiEndpointUrl, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to create clinic')),
    );
  }
}
