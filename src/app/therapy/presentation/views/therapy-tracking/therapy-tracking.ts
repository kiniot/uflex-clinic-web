import { Component, computed, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { StatCard } from '../../../../shared/presentation/components/stat-card/stat-card';
import { TherapySessionHistoryItemResource } from '../../../infrastructure/therapy-session.response';
import { SessionDetailPanel } from '../../components/session-detail-panel/session-detail-panel';
import { SessionHistoryTable } from '../../components/session-history-table/session-history-table';
import { TherapyDashboardBase, TherapyRoleContext } from '../shared/therapy-dashboard.base';

/**
 * Therapy follow-up centre for the physiotherapist: pick a patient and inspect how their therapy is
 * actually going.
 *
 * <p>Read-only by design. This view used to be an execution console (prepare → confirm hardware →
 * start → finalize), which duplicated the patient's mobile app and asked the clinician to attest,
 * from the clinic, that the sensors were on the patient's arm — something only the patient can
 * know. Meanwhile the thing that actually matters, seeing the history, was impossible.
 *
 * <p>The KPIs are derived from the history in the client rather than fetched: the backend already
 * returns each session's aggregates, and the plan metadata they would need to be computed against
 * lives in planning, which this page already loads.
 */
@Component({
  selector: 'app-therapy-tracking',
  imports: [TranslatePipe, ButtonModule, StatCard, SessionHistoryTable, SessionDetailPanel],
  templateUrl: './therapy-tracking.html',
  styleUrl: './therapy-tracking.scss',
})
export class TherapyTracking extends TherapyDashboardBase implements OnInit {
  protected readonly roleContext: TherapyRoleContext = 'physiotherapist';

  protected readonly sessionHistory = this.therapySessionStore.sessionHistory;
  protected readonly isLoadingHistory = this.therapySessionStore.isLoadingHistory;
  protected readonly selectedSessionId = this.therapySessionStore.selectedSessionId;
  protected readonly selectedSessionDetail = this.therapySessionStore.selectedSessionDetail;
  protected readonly isLoadingDetail = this.therapySessionStore.isLoadingDetail;

  protected readonly totalSessions = computed(() => this.sessionHistory().length);
  protected readonly completedSessions = computed(
    () => this.sessionHistory().filter((session) => session.status === 'Completed').length,
  );
  protected readonly totalRepetitions = computed(() =>
    this.sumOverHistory((session) => session.totalRepetitions),
  );
  protected readonly goodRepetitions = computed(() =>
    this.sumOverHistory((session) => session.goodRepetitions),
  );
  protected readonly sessionsRequiringReviewCount = computed(
    () => this.sessionHistory().filter((session) => session.requiresClinicalReview).length,
  );

  /** Mean of the per-session means; sessions without repetitions carry no ROM and are skipped. */
  protected readonly averageRomLabel = computed(() => {
    const values = this.sessionHistory()
      .map((session) => session.averageAchievedRom)
      .filter((rom): rom is number => rom !== null);
    if (!values.length) return '—';
    const mean = values.reduce((total, rom) => total + rom, 0) / values.length;
    return `${mean.toFixed(1)}°`;
  });

  async ngOnInit(): Promise<void> {
    await this.initializeDashboard();
  }

  protected override async loadPatientWorkspace(patientId: string, date?: string): Promise<void> {
    await super.loadPatientWorkspace(patientId, date);
    await this.therapySessionStore.loadSessionHistory(patientId);
  }

  protected onSelectSession(session: TherapySessionHistoryItemResource) {
    if (this.selectedSessionId() === session.sessionId) {
      this.onCloseSession();
      return;
    }
    void this.therapySessionStore.selectSession(session.sessionId);
  }

  protected onCloseSession() {
    this.therapySessionStore.clearSelectedSession();
  }

  private sumOverHistory(
    pick: (session: TherapySessionHistoryItemResource) => number | null,
  ): number {
    return this.sessionHistory().reduce((total, session) => total + (pick(session) ?? 0), 0);
  }
}
