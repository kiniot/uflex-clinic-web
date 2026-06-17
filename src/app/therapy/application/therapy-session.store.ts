import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TherapyApi } from '../infrastructure/therapy-api';
import {
  DailyScheduleResource,
  SessionProgressResource,
  TherapySessionResource,
} from '../infrastructure/therapy-session.response';

@Injectable({ providedIn: 'root' })
export class TherapySessionStore {
  private readonly selectedPatientIdSignal = signal<string | null>(null);
  private readonly activeSessionSignal = signal<TherapySessionResource | null>(null);
  private readonly dailyScheduleSignal = signal<DailyScheduleResource | null>(null);
  private readonly sessionProgressSignal = signal<SessionProgressResource | null>(null);
  private readonly loadingPatientContextSignal = signal(false);
  private readonly contextErrorSignal = signal<string | null>(null);

  readonly selectedPatientId = this.selectedPatientIdSignal.asReadonly();
  readonly activeSession = this.activeSessionSignal.asReadonly();
  readonly dailySchedule = this.dailyScheduleSignal.asReadonly();
  readonly sessionProgress = this.sessionProgressSignal.asReadonly();
  readonly isLoadingPatientContext = this.loadingPatientContextSignal.asReadonly();
  readonly contextError = this.contextErrorSignal.asReadonly();

  readonly hasActiveSession = computed(() => this.activeSession() !== null);
  readonly hasScheduledRoutine = computed(() => this.dailySchedule()?.routineId !== null);

  constructor(private readonly therapyApi: TherapyApi) {}

  async loadPatientContext(patientId: string, date?: string): Promise<void> {
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

  clearSelection() {
    this.selectedPatientIdSignal.set(null);
    this.activeSessionSignal.set(null);
    this.dailyScheduleSignal.set(null);
    this.sessionProgressSignal.set(null);
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
    return error instanceof Error && error.message.includes('Resource not found');
  }
}
