import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';
import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';
import {
  PhysiotherapistProfileResource,
  PhysiotherapistProfileResponse,
} from './physiotherapist-profile-response';

const registerPhysiotherapistApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderRegisterPhysiotherapistEndpointPath,
);

export class RegisterPhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PhysiotherapistProfileAssembler,
  ) {
    super();
  }

  registerPhysiotherapist(
    command: RegisterPhysiotherapistCommand,
  ): Observable<PhysiotherapistProfileResource> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http
      .post<PhysiotherapistProfileResponse>(registerPhysiotherapistApiEndpointUrl, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to register physiotherapist')),
      );
  }
}
