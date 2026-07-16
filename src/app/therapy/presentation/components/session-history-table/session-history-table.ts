import { DatePipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { TherapySessionHistoryItemResource } from '../../../infrastructure/therapy-session.response';

const PAGE_SIZE = 10;

/**
 * A patient's therapy sessions, newest first. Each row opens that session's detail.
 *
 * <p>Paginated in the client: the endpoint returns the patient's whole history (capped at 500)
 * because the ROM trend has to plot the full series, and a server-side page would truncate the line.
 * Rendering all of it at once, though, buries everything below it under a very long scroll.
 */
@Component({
  selector: 'app-session-history-table',
  imports: [TranslatePipe, DatePipe, PaginatorModule],
  templateUrl: './session-history-table.html',
  styleUrl: './session-history-table.scss',
})
export class SessionHistoryTable {
  readonly sessions = input.required<TherapySessionHistoryItemResource[]>();
  readonly selectedSessionId = input<string | null>(null);
  readonly selectSession = output<TherapySessionHistoryItemResource>();

  protected readonly pageSize = PAGE_SIZE;
  private readonly firstSignal = signal(0);

  protected readonly first = this.firstSignal.asReadonly();

  protected readonly pagedSessions = computed(() =>
    this.sessions().slice(this.firstSignal(), this.firstSignal() + PAGE_SIZE),
  );

  protected readonly showPaginator = computed(() => this.sessions().length > PAGE_SIZE);

  constructor() {
    // Switching patient replaces the list; staying on page 4 of the previous one would show nothing.
    effect(() => {
      this.sessions();
      this.firstSignal.set(0);
    });
  }

  protected onPageChange(event: { first?: number }) {
    this.firstSignal.set(event.first ?? 0);
  }

  protected sessionStatusKey(session: TherapySessionHistoryItemResource): string {
    return `therapySessions.statuses.session.${session.status ?? 'Unknown'}`;
  }

  protected romLabel(session: TherapySessionHistoryItemResource): string {
    return session.averageAchievedRom !== null ? `${session.averageAchievedRom.toFixed(1)}°` : '—';
  }

  protected seriesLabel(session: TherapySessionHistoryItemResource): string {
    return `${session.completedSeries ?? 0} / ${session.totalSeries ?? 0}`;
  }

  /** Share of repetitions the edge classified as Good; the gap is the clinical signal. */
  protected qualityRatio(session: TherapySessionHistoryItemResource): number | null {
    const total = session.totalRepetitions ?? 0;
    if (!total) return null;
    return (session.goodRepetitions ?? 0) / total;
  }

  protected qualityTone(session: TherapySessionHistoryItemResource): string {
    const ratio = this.qualityRatio(session);
    if (ratio === null) return 'empty';
    if (ratio >= 0.7) return 'good';
    if (ratio >= 0.3) return 'warn';
    return 'danger';
  }

  /** A session where nobody reported pain has no reading, which is not the same as a zero. */
  protected painLevel(session: TherapySessionHistoryItemResource): number | null {
    if (!session.totalRepetitions) return null;
    return session.maxReportedPainLevel ?? null;
  }

  /** The backend flags a session for review at 3 reports of 7+, or a single 10. */
  protected painTone(session: TherapySessionHistoryItemResource): string {
    const pain = this.painLevel(session);
    if (pain === null) return 'empty';
    if (pain >= 7) return 'danger';
    if (pain >= 4) return 'warn';
    return 'good';
  }

  protected compensations(session: TherapySessionHistoryItemResource): number {
    return session.compensatoryMovementsDetected ?? 0;
  }
}
