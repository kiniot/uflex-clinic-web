import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { catchError, map, Observable } from 'rxjs';
import { CancelTherapySessionCommand } from '../domain/model/cancel-therapy-session.command';
import { ConfirmHardwareReadinessCommand } from '../domain/model/confirm-hardware-readiness.command';
import { InitiateTherapyPreparationCommand } from '../domain/model/initiate-therapy-preparation.command';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  DailyScheduleResource,
  DailyScheduleResponse,
  SerieDetailsResource,
  SerieDetailsResponse,
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

export class InitiateTherapyPreparationApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  initiatePreparation(
    command: InitiateTherapyPreparationCommand,
  ): Observable<TherapySessionResource> {
    const request = this.assembler.toInitiatePreparationRequestFromCommand(command);
    return this.http.post<TherapySessionResponse>(therapySessionsEndpointUrl, request).pipe(
      map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
      catchError(this.handleError('Failed to initiate therapy preparation')),
    );
  }
}

export class ConfirmHardwareReadinessApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  confirmHardwareReadiness(
    sessionId: string,
    command: ConfirmHardwareReadinessCommand,
  ): Observable<TherapySessionResource> {
    const request = this.assembler.toConfirmHardwareReadinessRequestFromCommand(command);
    return this.http
      .patch<TherapySessionResponse>(`${therapySessionsEndpointUrl}/${sessionId}/hardware`, request)
      .pipe(
        map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
        catchError(this.handleError('Failed to confirm hardware readiness')),
      );
  }
}

export class StartTherapySessionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  start(sessionId: string): Observable<TherapySessionResource> {
    return this.http
      .patch<TherapySessionResponse>(`${therapySessionsEndpointUrl}/${sessionId}/start`, {})
      .pipe(
        map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
        catchError(this.handleError('Failed to start therapy session')),
      );
  }
}

export class FinalizeTherapySessionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  finalize(sessionId: string): Observable<TherapySessionResource> {
    return this.http
      .patch<TherapySessionResponse>(`${therapySessionsEndpointUrl}/${sessionId}/finalize`, {})
      .pipe(
        map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
        catchError(this.handleError('Failed to finalize therapy session')),
      );
  }
}

export class CancelTherapySessionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  cancel(
    sessionId: string,
    command: CancelTherapySessionCommand,
  ): Observable<TherapySessionResource> {
    const request = this.assembler.toCancelTherapySessionRequestFromCommand(command);
    return this.http
      .patch<TherapySessionResponse>(`${therapySessionsEndpointUrl}/${sessionId}/cancel`, request)
      .pipe(
        map((response) => this.assembler.toTherapySessionResourceFromResponse(response)),
        catchError(this.handleError('Failed to cancel therapy session')),
      );
  }
}

export class GetActiveTherapySessionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

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

export class GetSerieDetailsApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  getSerieDetails(sessionId: string, serieId: string): Observable<SerieDetailsResource> {
    return this.http
      .get<SerieDetailsResponse>(`${therapySessionsEndpointUrl}/${sessionId}/series/${serieId}`)
      .pipe(
        map((response) => this.assembler.toSerieDetailsResourceFromResponse(response)),
        catchError(this.handleError('Failed to get serie details')),
      );
  }
}

export class StartSerieApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: TherapySessionAssembler,
  ) {
    super();
  }

  startSerie(sessionId: string, serieId: string): Observable<SerieDetailsResource> {
    return this.http
      .patch<SerieDetailsResponse>(
        `${therapySessionsEndpointUrl}/${sessionId}/series/${serieId}/start`,
        {},
      )
      .pipe(
        map((response) => this.assembler.toSerieDetailsResourceFromResponse(response)),
        catchError(this.handleError('Failed to start serie')),
      );
  }
}
