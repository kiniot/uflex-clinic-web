import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';
import {
  PhysiotherapistProfileResource,
  PhysiotherapistProfileResponse,
} from './physiotherapist-profile-response';

const physiotherapistByIdApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPhysiotherapistByIdEndpointPath,
);

export class PhysiotherapistByIdApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PhysiotherapistProfileAssembler,
  ) {
    super();
  }

  getPhysiotherapistById(id: string): Observable<PhysiotherapistProfileResource> {
    return this.http
      .get<PhysiotherapistProfileResponse>(`${physiotherapistByIdApiEndpointUrl}/${id}`)
      .pipe(
        map((response) => this.assembler.toResourceFromResponse(response)),
        catchError(this.handleError('Failed to load physiotherapist')),
      );
  }
}
