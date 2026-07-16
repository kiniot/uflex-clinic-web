import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TherapySessionHistoryItemResource } from '../../../infrastructure/therapy-session.response';
import { PatientRoster } from '../../components/patient-roster/patient-roster';
import { SessionDetailPanel } from '../../components/session-detail-panel/session-detail-panel';
import { SessionHistoryTable } from '../../components/session-history-table/session-history-table';
import { TherapyChart, TherapyChartSeries } from '../../components/therapy-chart/therapy-chart';
import { TrackingKpi, TrackingKpis } from '../../components/tracking-kpis/tracking-kpis';
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
 * returns each session's aggregates, and the plan metadata they would be computed against lives in
 * planning, which this page already loads.
 */
@Component({
  selector: 'app-therapy-tracking',
  imports: [
    TranslatePipe,
    ButtonModule,
    DrawerModule,
    PatientRoster,
    TrackingKpis,
    SessionHistoryTable,
    SessionDetailPanel,
    TherapyChart,
  ],
  templateUrl: './therapy-tracking.html',
  styleUrl: './therapy-tracking.scss',
})
export class TherapyTracking extends TherapyDashboardBase implements OnInit {
  protected readonly roleContext: TherapyRoleContext = 'physiotherapist';

  private readonly translateService = inject(TranslateService);

  protected readonly sessionHistory = this.therapySessionStore.sessionHistory;
  protected readonly isLoadingHistory = this.therapySessionStore.isLoadingHistory;
  protected readonly selectedSessionId = this.therapySessionStore.selectedSessionId;
  protected readonly selectedSessionDetail = this.therapySessionStore.selectedSessionDetail;
  protected readonly isLoadingDetail = this.therapySessionStore.isLoadingDetail;

  /** The roster can only mark a session it already knows about: the selected patient's. */
  protected readonly patientIdInSession = computed(() =>
    this.hasActiveSession() ? this.selectedPatientId() : null,
  );

  /**
   * The drawer's own state, not a projection of the selected session. p-drawer owns `visible`
   * internally and writes to it when the user dismisses it; driving it from a read-only computed
   * leaves the two disagreeing, and the drawer stays open.
   */
  protected readonly isDrawerOpen = signal(false);

  private readonly totalSessions = computed(() => this.sessionHistory().length);
  private readonly completedSessions = computed(
    () => this.sessionHistory().filter((session) => session.status === 'Completed').length,
  );
  private readonly totalRepetitions = computed(() =>
    this.sumOverHistory((session) => session.totalRepetitions),
  );
  private readonly goodRepetitions = computed(() =>
    this.sumOverHistory((session) => session.goodRepetitions),
  );
  private readonly sessionsRequiringReviewCount = computed(
    () => this.sessionHistory().filter((session) => session.requiresClinicalReview).length,
  );

  /**
   * Sessions that actually measured something, oldest first. A session with no repetitions has no
   * ROM to plot, and the history arrives newest-first, which would draw the trend backwards.
   */
  private readonly romTrendSessions = computed(() =>
    this.sessionHistory()
      .filter((session) => session.averageAchievedRom !== null)
      .slice()
      .reverse(),
  );

  /** Mean of the per-session means. */
  private readonly averageRom = computed(() => {
    const values = this.romTrendSessions().map((session) => session.averageAchievedRom!);
    if (!values.length) return null;
    return values.reduce((total, rom) => total + rom, 0) / values.length;
  });

  protected readonly kpis = computed<TrackingKpi[]>(() => {
    const total = this.totalRepetitions();
    const good = this.goodRepetitions();
    const goodRatio = total ? good / total : null;
    const rom = this.averageRom();
    const needsReview = this.sessionsRequiringReviewCount();

    return [
      {
        labelKey: 'therapySessions.tracking.kpi.sessions',
        value: `${this.totalSessions()}`,
        hint: this.translateService.instant('therapySessions.tracking.kpi.sessionsSub', {
          completed: this.completedSessions(),
        }),
        tone: 'neutral',
      },
      {
        labelKey: 'therapySessions.tracking.kpi.repetitions',
        value: `${total}`,
        hint: this.translateService.instant('therapySessions.tracking.kpi.repetitionsSub', {
          good,
          percent: goodRatio !== null ? Math.round(goodRatio * 100) : 0,
        }),
        // A low share of good repetitions is the finding, so let it look like one.
        tone: this.ratioTone(goodRatio),
      },
      {
        labelKey: 'therapySessions.tracking.kpi.averageRom',
        value: rom !== null ? `${rom.toFixed(1)}°` : '—',
        hint: this.translateService.instant('therapySessions.tracking.kpi.averageRomSub'),
        tone: 'neutral',
      },
      {
        labelKey: 'therapySessions.tracking.kpi.review',
        value: `${needsReview}`,
        hint: this.translateService.instant('therapySessions.tracking.kpi.reviewSub'),
        tone: needsReview > 0 ? 'danger' : 'neutral',
      },
    ];
  });

  protected readonly hasRomTrend = computed(() => this.romTrendSessions().length > 1);

  protected readonly romTrendLabels = computed(() =>
    this.romTrendSessions().map((session) =>
      session.startedAt ? this.shortDate(session.startedAt) : '—',
    ),
  );

  protected readonly romTrendSeries = computed<TherapyChartSeries[]>(() => [
    {
      label: this.translateService.instant('therapySessions.tracking.chart.romSeries'),
      values: this.romTrendSessions().map((session) => session.averageAchievedRom),
      colorToken: '--p-primary-500',
      fill: true,
    },
  ]);

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
    this.isDrawerOpen.set(true);
    void this.therapySessionStore.selectSession(session.sessionId);
  }

  /** Covers every way the drawer dismisses itself: the close button, the mask, and Esc. */
  protected onDrawerVisibleChange(visible: boolean) {
    this.isDrawerOpen.set(visible);
    if (!visible) this.therapySessionStore.clearSelectedSession();
  }

  protected onCloseSession() {
    this.isDrawerOpen.set(false);
    this.therapySessionStore.clearSelectedSession();
  }

  private ratioTone(ratio: number | null): TrackingKpi['tone'] {
    if (ratio === null) return 'neutral';
    if (ratio >= 0.7) return 'good';
    if (ratio >= 0.3) return 'warn';
    return 'danger';
  }

  private sumOverHistory(
    pick: (session: TherapySessionHistoryItemResource) => number | null,
  ): number {
    return this.sessionHistory().reduce((total, session) => total + (pick(session) ?? 0), 0);
  }

  private shortDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(this.translateService.currentLang ?? 'es', {
      day: '2-digit',
      month: 'short',
    });
  }
}
