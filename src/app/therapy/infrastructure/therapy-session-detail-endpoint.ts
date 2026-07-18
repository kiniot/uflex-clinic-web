import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  TherapySessionDetailResource,
  TherapySessionDetailResponse,
} from './therapy-session.response';

const therapySessionsEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTherapySessionsEndpointPath,
);

export class TherapySessionDetailApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  /** Resolves in any session status, including a session still in progress. */
  getDetail(sessionId: string): Observable<TherapySessionDetailResource> {
    return this.http
      .get<TherapySessionDetailResponse>(`${therapySessionsEndpointUrl}/${sessionId}/detail`)
      .pipe(
        map((response) => this.assembler.toTherapySessionDetailResourceFromResponse(response)),
        catchError(this.handleError('Failed to load therapy session detail')),
      );
  }
}
