import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { catchError, map, Observable } from 'rxjs';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  DailyScheduleResource,
  DailyScheduleResponse,
  SessionProgressResource,
  SessionProgressResponse,
  SessionSummaryResource,
  SessionSummaryResponse,
  TherapySessionResource,
  TherapySessionResponse,
} from './therapy-session.response';

const therapySessionsEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderTherapySessionsEndpointPath,
);

export class GetActiveTherapySessionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  /** Answers 404 when the patient has no session running; that is the normal case, not an error. */
  getActiveByPatientId(patientId: string): Observable<TherapySessionResource> {
    return this.http
      .get<TherapySessionResponse>(`${therapySessionsEndpointUrl}/active/${patientId}`)
      .pipe(
        map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
        catchError(this.handleError('Failed to get active therapy session')),
      );
  }
}

export class GetSessionSummaryApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  /** Only resolves once the session is finished; use the detail endpoint for a running one. */
  getSummary(sessionId: string): Observable<SessionSummaryResource> {
    return this.http
      .get<SessionSummaryResponse>(`${therapySessionsEndpointUrl}/${sessionId}/summary`)
      .pipe(
        map((response) => this.assembler.toSessionSummaryResourceFromResponse(response)),
        catchError(this.handleError('Failed to get therapy session summary')),
      );
  }
}

export class GetDailyScheduleApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  getSchedule(patientId: string, date?: string): Observable<DailyScheduleResource> {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.http
      .get<DailyScheduleResponse>(`${therapySessionsEndpointUrl}/schedule/${patientId}${query}`)
      .pipe(
        map((response) => this.assembler.toDailyScheduleResourceFromResponse(response)),
        catchError(this.handleError('Failed to get therapy daily schedule')),
      );
  }
}

export class GetSessionProgressApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  getProgress(sessionId: string): Observable<SessionProgressResource> {
    return this.http
      .get<SessionProgressResponse>(`${therapySessionsEndpointUrl}/${sessionId}/progress`)
      .pipe(
        map((response) => this.assembler.toSessionProgressResourceFromResponse(response)),
        catchError(this.handleError('Failed to get therapy session progress')),
      );
  }
}
