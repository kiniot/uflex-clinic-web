import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { PatientTherapySessionsApiEndpoint } from './patient-therapy-sessions-endpoint';
import { TherapySessionDetailApiEndpoint } from './therapy-session-detail-endpoint';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  GetActiveTherapySessionApiEndpoint,
  GetDailyScheduleApiEndpoint,
  GetSessionProgressApiEndpoint,
  GetSessionSummaryApiEndpoint,
} from './therapy-session-endpoints';
import {
  DailyScheduleResource,
  SessionProgressResource,
  SessionSummaryResource,
  TherapySessionDetailResource,
  TherapySessionHistoryItemResource,
  TherapySessionResource,
} from './therapy-session.response';

/**
 * Read-only client for therapy sessions. The clinic web follows therapy, it does not drive it:
 * preparing, starting and finalizing a session belong to the patient's mobile app, which is the
 * only place that can actually tell whether the sensors are on the arm.
 */
@Injectable({ providedIn: 'root' })
export class TherapyApi extends BaseApi {
  private readonly getActiveTherapySessionEndpoint: GetActiveTherapySessionApiEndpoint;
  private readonly getSessionSummaryEndpoint: GetSessionSummaryApiEndpoint;
  private readonly getDailyScheduleEndpoint: GetDailyScheduleApiEndpoint;
  private readonly getSessionProgressEndpoint: GetSessionProgressApiEndpoint;
  private readonly patientTherapySessionsEndpoint: PatientTherapySessionsApiEndpoint;
  private readonly therapySessionDetailEndpoint: TherapySessionDetailApiEndpoint;

  constructor(http: HttpClient) {
    super();
    const assembler = new TherapySessionAssembler();
    this.getActiveTherapySessionEndpoint = new GetActiveTherapySessionApiEndpoint(http, assembler);
    this.getSessionSummaryEndpoint = new GetSessionSummaryApiEndpoint(http, assembler);
    this.getDailyScheduleEndpoint = new GetDailyScheduleApiEndpoint(http, assembler);
    this.getSessionProgressEndpoint = new GetSessionProgressApiEndpoint(http, assembler);
    this.patientTherapySessionsEndpoint = new PatientTherapySessionsApiEndpoint(http, assembler);
    this.therapySessionDetailEndpoint = new TherapySessionDetailApiEndpoint(http, assembler);
  }

  getHistoryByPatient(
    patientId: string,
    treatmentPlanId?: string,
  ): Observable<TherapySessionHistoryItemResource[]> {
    return this.patientTherapySessionsEndpoint.getHistoryByPatient(patientId, treatmentPlanId);
  }

  getDetail(sessionId: string): Observable<TherapySessionDetailResource> {
    return this.therapySessionDetailEndpoint.getDetail(sessionId);
  }

  getActiveByPatientId(patientId: string): Observable<TherapySessionResource> {
    return this.getActiveTherapySessionEndpoint.getActiveByPatientId(patientId);
  }

  getSummary(sessionId: string): Observable<SessionSummaryResource> {
    return this.getSessionSummaryEndpoint.getSummary(sessionId);
  }

  getSchedule(patientId: string, date?: string): Observable<DailyScheduleResource> {
    return this.getDailyScheduleEndpoint.getSchedule(patientId, date);
  }

  getProgress(sessionId: string): Observable<SessionProgressResource> {
    return this.getSessionProgressEndpoint.getProgress(sessionId);
  }
}
