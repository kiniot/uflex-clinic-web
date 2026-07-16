import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { isAppError } from '../../shared/domain/model/app-error';
import { TherapyApi } from '../infrastructure/therapy-api';
import {
  DailyScheduleResource,
  PatientTherapyOverviewResource,
  SessionProgressResource,
  TherapySessionDetailResource,
  TherapySessionHistoryItemResource,
  TherapySessionResource,
} from '../infrastructure/therapy-session.response';

@Injectable({ providedIn: 'root' })
export class TherapySessionStore {
  private readonly selectedPatientIdSignal = signal<string | null>(null);
  private readonly activeSessionSignal = signal<TherapySessionResource | null>(null);
  private readonly dailyScheduleSignal = signal<DailyScheduleResource | null>(null);
  private readonly sessionProgressSignal = signal<SessionProgressResource | null>(null);
  private readonly sessionHistorySignal = signal<TherapySessionHistoryItemResource[]>([]);
  private readonly selectedSessionIdSignal = signal<string | null>(null);
  private readonly selectedSessionDetailSignal = signal<TherapySessionDetailResource | null>(null);
  private readonly patientOverviewSignal = signal<PatientTherapyOverviewResource[]>([]);
  private readonly loadingPatientContextSignal = signal(false);
  private readonly loadingHistorySignal = signal(false);
  private readonly loadingDetailSignal = signal(false);
  private readonly loadingOverviewSignal = signal(false);
  private readonly contextErrorSignal = signal<string | null>(null);
  private readonly overviewErrorSignal = signal<string | null>(null);

  readonly selectedPatientId = this.selectedPatientIdSignal.asReadonly();
  readonly activeSession = this.activeSessionSignal.asReadonly();
  readonly dailySchedule = this.dailyScheduleSignal.asReadonly();
  readonly sessionProgress = this.sessionProgressSignal.asReadonly();
  readonly sessionHistory = this.sessionHistorySignal.asReadonly();
  readonly selectedSessionId = this.selectedSessionIdSignal.asReadonly();
  readonly selectedSessionDetail = this.selectedSessionDetailSignal.asReadonly();
  readonly patientOverview = this.patientOverviewSignal.asReadonly();
  readonly isLoadingPatientContext = this.loadingPatientContextSignal.asReadonly();
  readonly isLoadingHistory = this.loadingHistorySignal.asReadonly();
  readonly isLoadingDetail = this.loadingDetailSignal.asReadonly();
  readonly isLoadingOverview = this.loadingOverviewSignal.asReadonly();
  readonly contextError = this.contextErrorSignal.asReadonly();
  readonly overviewError = this.overviewErrorSignal.asReadonly();

  readonly hasActiveSession = computed(() => this.activeSession() !== null);
  readonly hasScheduledRoutine = computed(() => this.dailySchedule()?.routineId !== null);

  constructor(private readonly therapyApi: TherapyApi) {}

  async loadPatientContext(patientId: string, date?: string): Promise<void> {
    if (this.selectedPatientIdSignal() !== patientId) {
      // The open session belongs to the previous patient.
      this.clearSelectedSession();
      this.sessionHistorySignal.set([]);
    }
    this.selectedPatientIdSignal.set(patientId);
    this.loadingPatientContextSignal.set(true);
    this.contextErrorSignal.set(null);

    try {
      const schedulePromise = firstValueFrom(this.therapyApi.getSchedule(patientId, date));
      const activeSessionPromise = firstValueFrom(this.therapyApi.getActiveByPatientId(patientId));

      const [scheduleResult, activeSessionResult] = await Promise.allSettled([
        schedulePromise,
        activeSessionPromise,
      ]);

      if (scheduleResult.status === 'fulfilled') {
        this.dailyScheduleSignal.set(scheduleResult.value);
      } else {
        this.dailyScheduleSignal.set(null);
      }

      if (activeSessionResult.status === 'fulfilled') {
        this.activeSessionSignal.set(activeSessionResult.value);
        await this.loadProgressForSession(activeSessionResult.value.id);
      } else {
        this.activeSessionSignal.set(null);
        this.sessionProgressSignal.set(null);

        if (!this.isNotFound(activeSessionResult.reason) && scheduleResult.status === 'rejected') {
          this.contextErrorSignal.set('Failed to load therapy session context');
        }
      }

      if (scheduleResult.status === 'rejected' && !this.contextErrorSignal()) {
        this.contextErrorSignal.set('Failed to load therapy session context');
      }
    } finally {
      this.loadingPatientContextSignal.set(false);
    }
  }

  /** Therapy standing of the physiotherapist's whole caseload, for the index. */
  async loadPatientOverview(): Promise<void> {
    this.loadingOverviewSignal.set(true);
    try {
      const overview = await firstValueFrom(this.therapyApi.getPatientTherapyOverview());
      this.patientOverviewSignal.set(overview);
      this.overviewErrorSignal.set(null);
    } catch {
      this.patientOverviewSignal.set([]);
      this.overviewErrorSignal.set('Failed to load patient therapy overview');
    } finally {
      this.loadingOverviewSignal.set(false);
    }
  }

  /**
   * Loads a patient's session history.
   *
   * <p>Guarded against a stale response overwriting a newer selection: switching patients fires a
   * second load, and the first can still land afterwards.
   */
  async loadSessionHistory(patientId: string, treatmentPlanId?: string): Promise<void> {
    this.loadingHistorySignal.set(true);
    try {
      const history = await firstValueFrom(
        this.therapyApi.getHistoryByPatient(patientId, treatmentPlanId),
      );
      if (this.selectedPatientIdSignal() !== patientId) return;
      this.sessionHistorySignal.set(history);
    } catch {
      if (this.selectedPatientIdSignal() !== patientId) return;
      this.sessionHistorySignal.set([]);
      this.contextErrorSignal.set('Failed to load therapy session history');
    } finally {
      if (this.selectedPatientIdSignal() === patientId) {
        this.loadingHistorySignal.set(false);
      }
    }
  }

  /**
   * Loads the full detail of one session. Guarded the same way as the history: a slow response for
   * a previously selected session must not replace the one the clinician is looking at now.
   */
  async selectSession(sessionId: string): Promise<void> {
    this.selectedSessionIdSignal.set(sessionId);
    this.loadingDetailSignal.set(true);
    try {
      const detail = await firstValueFrom(this.therapyApi.getDetail(sessionId));
      if (this.selectedSessionIdSignal() !== sessionId) return;
      this.selectedSessionDetailSignal.set(detail);
    } catch {
      if (this.selectedSessionIdSignal() !== sessionId) return;
      this.selectedSessionDetailSignal.set(null);
      this.contextErrorSignal.set('Failed to load therapy session detail');
    } finally {
      if (this.selectedSessionIdSignal() === sessionId) {
        this.loadingDetailSignal.set(false);
      }
    }
  }

  clearSelectedSession() {
    this.selectedSessionIdSignal.set(null);
    this.selectedSessionDetailSignal.set(null);
  }

  clearSelection() {
    this.selectedPatientIdSignal.set(null);
    this.activeSessionSignal.set(null);
    this.dailyScheduleSignal.set(null);
    this.sessionProgressSignal.set(null);
    this.sessionHistorySignal.set([]);
    this.clearSelectedSession();
    this.contextErrorSignal.set(null);
  }

  applyActiveSessionUpdate(session: TherapySessionResource | null) {
    this.activeSessionSignal.set(session);
  }

  applySessionProgressUpdate(progress: SessionProgressResource | null) {
    this.sessionProgressSignal.set(progress);
  }

  private async loadProgressForSession(sessionId: string): Promise<void> {
    try {
      const progress = await firstValueFrom(this.therapyApi.getProgress(sessionId));
      this.sessionProgressSignal.set(progress);
    } catch (error) {
      this.sessionProgressSignal.set(null);
      if (!this.isNotFound(error)) {
        this.contextErrorSignal.set('Failed to load therapy session progress');
      }
    }
  }

  private isNotFound(error: unknown): boolean {
    return isAppError(error) && error.status === 404;
  }
}
