import { DestroyRef, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { isAppError } from '../../shared/domain/model/app-error';
import { TherapyApi } from '../infrastructure/therapy-api';
import { TherapySessionStore } from './therapy-session.store';

/** While a session runs, the clinician wants to see repetitions land. */
const LIVE_INTERVAL_MS = 3_000;

/**
 * While none does, we are only waiting for one to start. Polling that at live speed would be 7x
 * the requests for a question whose answer changes on a human timescale.
 */
const DISCOVERY_INTERVAL_MS = 20_000;

/**
 * Follows a patient's session as it happens.
 *
 * <p>The clinician is not on the patient's LAN, so the edge's SSE stream is out of reach; polling
 * the backend is the only way in. It is also what the mobile app already does.
 *
 * <p>Not `providedIn: 'root'` on purpose: it is scoped to the view that provides it, so leaving the
 * page tears the polling down with the component.
 */
@Injectable()
export class TherapyLive {
  private readonly therapyApi = inject(TherapyApi);
  private readonly therapySessionStore = inject(TherapySessionStore);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private patientId: string | null = null;
  /** Guards against a tick that was already in flight when the caller stopped or switched patient. */
  private generation = 0;
  /** Anchors the cadence to real time, so no sequence of events can poll faster than the interval. */
  private lastTickAt = 0;

  constructor() {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    // The listener outlives stop() — start() calls stop() first, and unbinding there would leave
    // every restart unable to pause again.
    inject(DestroyRef).onDestroy(() => {
      this.stop();
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  /** Call once the view's own load has settled: the first tick then waits a full interval instead
   * of re-asking for what was just fetched. */
  start(patientId: string) {
    this.stop();
    this.patientId = patientId;
    this.lastTickAt = Date.now();
    this.scheduleNext();
  }

  stop() {
    this.generation++;
    this.patientId = null;
    this.clearTimer();
  }

  /** A hidden tab is nobody watching. */
  private readonly onVisibilityChange = () => {
    if (!this.patientId) return;
    if (document.visibilityState === 'hidden') {
      this.clearTimer();
      return;
    }
    this.scheduleNext();
  };

  /**
   * Chained rather than an interval: the next tick is scheduled only once the current one settles,
   * so a slow backend queues requests instead of stacking them.
   *
   * <p>The delay is what remains of the interval since the last tick, not the full interval. That
   * keeps a burst of wake-ups — alt-tabbing, or an embedded browser that flaps visibility — from
   * turning into a request each, while still refreshing immediately when the data really is stale.
   */
  private scheduleNext() {
    if (!this.patientId || document.visibilityState === 'hidden') return;
    this.clearTimer();
    const interval = this.therapySessionStore.hasActiveSession()
      ? LIVE_INTERVAL_MS
      : DISCOVERY_INTERVAL_MS;
    const elapsed = Date.now() - this.lastTickAt;
    this.timeoutId = setTimeout(() => void this.tick(), Math.max(0, interval - elapsed));
  }

  private async tick(): Promise<void> {
    const patientId = this.patientId;
    if (!patientId) return;
    const generation = this.generation;
    const hadActiveSession = this.therapySessionStore.hasActiveSession();
    this.timeoutId = null;
    this.lastTickAt = Date.now();

    try {
      const session = await firstValueFrom(this.therapyApi.getActiveByPatientId(patientId));
      if (this.isStale(generation)) return;
      this.therapySessionStore.applyActiveSessionUpdate(session);

      const progress = await firstValueFrom(this.therapyApi.getProgress(session.id));
      if (this.isStale(generation)) return;
      this.therapySessionStore.applySessionProgressUpdate(progress);
    } catch (error) {
      if (this.isStale(generation)) return;
      // 404 is the contract for "no session running", not a failure.
      if (!isAppError(error) || error.status !== 404) return;
      this.therapySessionStore.applyActiveSessionUpdate(null);
      this.therapySessionStore.applySessionProgressUpdate(null);
      // The session just ended: it is now part of the history, with its final aggregates.
      if (hadActiveSession) {
        await this.therapySessionStore.loadSessionHistory(patientId, { silent: true });
      }
    } finally {
      if (!this.isStale(generation)) this.scheduleNext();
    }
  }

  private clearTimer() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private isStale(generation: number): boolean {
    return generation !== this.generation || this.patientId === null;
  }
}
