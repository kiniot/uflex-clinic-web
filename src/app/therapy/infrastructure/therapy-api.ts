import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { CancelTherapySessionCommand } from '../domain/model/cancel-therapy-session.command';
import { ConfirmHardwareReadinessCommand } from '../domain/model/confirm-hardware-readiness.command';
import { InitiateTherapyPreparationCommand } from '../domain/model/initiate-therapy-preparation.command';
import { TherapySessionAssembler } from './therapy-session.assembler';
import {
  ConfirmHardwareReadinessApiEndpoint,
  FinalizeTherapySessionApiEndpoint,
  GetActiveTherapySessionApiEndpoint,
  GetDailyScheduleApiEndpoint,
  GetSerieDetailsApiEndpoint,
  GetSessionProgressApiEndpoint,
  GetSessionSummaryApiEndpoint,
  InitiateTherapyPreparationApiEndpoint,
  StartSerieApiEndpoint,
  StartTherapySessionApiEndpoint,
  CancelTherapySessionApiEndpoint,
} from './therapy-session-endpoints';
import {
  DailyScheduleResource,
  SerieDetailsResource,
  SessionProgressResource,
  SessionSummaryResource,
  TherapySessionResource,
} from './therapy-session.response';

@Injectable({ providedIn: 'root' })
export class TherapyApi extends BaseApi {
  private readonly initiatePreparationEndpoint: InitiateTherapyPreparationApiEndpoint;
  private readonly confirmHardwareReadinessEndpoint: ConfirmHardwareReadinessApiEndpoint;
  private readonly startTherapySessionEndpoint: StartTherapySessionApiEndpoint;
  private readonly finalizeTherapySessionEndpoint: FinalizeTherapySessionApiEndpoint;
  private readonly cancelTherapySessionEndpoint: CancelTherapySessionApiEndpoint;
  private readonly getActiveTherapySessionEndpoint: GetActiveTherapySessionApiEndpoint;
  private readonly getSessionSummaryEndpoint: GetSessionSummaryApiEndpoint;
  private readonly getDailyScheduleEndpoint: GetDailyScheduleApiEndpoint;
  private readonly getSessionProgressEndpoint: GetSessionProgressApiEndpoint;
  private readonly getSerieDetailsEndpoint: GetSerieDetailsApiEndpoint;
  private readonly startSerieEndpoint: StartSerieApiEndpoint;

  constructor(http: HttpClient) {
    super();
    const assembler = new TherapySessionAssembler();
    this.initiatePreparationEndpoint = new InitiateTherapyPreparationApiEndpoint(http, assembler);
    this.confirmHardwareReadinessEndpoint = new ConfirmHardwareReadinessApiEndpoint(
      http,
      assembler,
    );
    this.startTherapySessionEndpoint = new StartTherapySessionApiEndpoint(http, assembler);
    this.finalizeTherapySessionEndpoint = new FinalizeTherapySessionApiEndpoint(http, assembler);
    this.cancelTherapySessionEndpoint = new CancelTherapySessionApiEndpoint(http, assembler);
    this.getActiveTherapySessionEndpoint = new GetActiveTherapySessionApiEndpoint(http, assembler);
    this.getSessionSummaryEndpoint = new GetSessionSummaryApiEndpoint(http, assembler);
    this.getDailyScheduleEndpoint = new GetDailyScheduleApiEndpoint(http, assembler);
    this.getSessionProgressEndpoint = new GetSessionProgressApiEndpoint(http, assembler);
    this.getSerieDetailsEndpoint = new GetSerieDetailsApiEndpoint(http, assembler);
    this.startSerieEndpoint = new StartSerieApiEndpoint(http, assembler);
  }

  initiatePreparation(
    command: InitiateTherapyPreparationCommand,
  ): Observable<TherapySessionResource> {
    return this.initiatePreparationEndpoint.initiatePreparation(command);
  }

  confirmHardwareReadiness(
    sessionId: string,
    command: ConfirmHardwareReadinessCommand,
  ): Observable<TherapySessionResource> {
    return this.confirmHardwareReadinessEndpoint.confirmHardwareReadiness(sessionId, command);
  }

  start(sessionId: string): Observable<TherapySessionResource> {
    return this.startTherapySessionEndpoint.start(sessionId);
  }

  finalize(sessionId: string): Observable<TherapySessionResource> {
    return this.finalizeTherapySessionEndpoint.finalize(sessionId);
  }

  cancel(
    sessionId: string,
    command: CancelTherapySessionCommand,
  ): Observable<TherapySessionResource> {
    return this.cancelTherapySessionEndpoint.cancel(sessionId, command);
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

  getSerieDetails(sessionId: string, serieId: string): Observable<SerieDetailsResource> {
    return this.getSerieDetailsEndpoint.getSerieDetails(sessionId, serieId);
  }

  startSerie(sessionId: string, serieId: string): Observable<SerieDetailsResource> {
    return this.startSerieEndpoint.startSerie(sessionId, serieId);
  }
}
