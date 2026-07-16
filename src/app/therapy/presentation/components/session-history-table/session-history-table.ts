import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TherapySessionHistoryItemResource } from '../../../infrastructure/therapy-session.response';

/**
 * A patient's therapy sessions, newest first. Each row is a drill-down entry point into the
 * session's series and repetitions.
 */
@Component({
  selector: 'app-session-history-table',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './session-history-table.html',
  styleUrl: './session-history-table.scss',
})
export class SessionHistoryTable {
  readonly sessions = input.required<TherapySessionHistoryItemResource[]>();
  readonly selectedSessionId = input<string | null>(null);
  readonly selectSession = output<TherapySessionHistoryItemResource>();

  protected sessionStatusKey(session: TherapySessionHistoryItemResource): string {
    return `therapySessions.statuses.session.${session.status ?? 'Unknown'}`;
  }

  protected romLabel(session: TherapySessionHistoryItemResource): string {
    return session.averageAchievedRom !== null ? `${session.averageAchievedRom.toFixed(1)}°` : '—';
  }

  /** Reads as "good / total"; the gap between the two is the point of the column. */
  protected qualityLabel(session: TherapySessionHistoryItemResource): string {
    return `${session.goodRepetitions ?? 0} / ${session.totalRepetitions ?? 0}`;
  }

  protected seriesLabel(session: TherapySessionHistoryItemResource): string {
    return `${session.completedSeries ?? 0} / ${session.totalSeries ?? 0}`;
  }
}
