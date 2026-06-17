import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdatePhysiotherapistCommand } from '../domain/model/update-physiotherapist.command';
import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';
import {
  PhysiotherapistProfileResource,
  PhysiotherapistProfileResponse,
} from './physiotherapist-profile-response';

const updatePhysiotherapistApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderUpdatePhysiotherapistEndpointPath,
);

export class UpdatePhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PhysiotherapistProfileAssembler,
  ) {
    super();
  }

  updatePhysiotherapist(
    id: string,
    command: UpdatePhysiotherapistCommand,
  ): Observable<PhysiotherapistProfileResource> {
    const request = this.assembler.toUpdateRequestFromCommand(command);
    return this.http
      .put<PhysiotherapistProfileResponse>(`${updatePhysiotherapistApiEndpointUrl}/${id}`, request)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to update physiotherapist')),
      );
  }
}
