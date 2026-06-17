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

const physiotherapistsApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderPhysiotherapistsEndpointPath,
);

export class PhysiotherapistsApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: PhysiotherapistProfileAssembler,
  ) {
    super();
  }

  getPhysiotherapists(): Observable<PhysiotherapistProfileResource[]> {
    return this.http.get<PhysiotherapistProfileResponse[]>(physiotherapistsApiEndpointUrl).pipe(
      map((responses) =>
        responses.map((response) => this.assembler.toResourceFromResponse(response)),
      ),
      catchError(this.handleError('Failed to load clinic physiotherapists')),
    );
  }
}
