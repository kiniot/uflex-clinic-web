import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TherapyLive } from '../../../application/therapy-live';
import { TherapySessionHistoryItemResource } from '../../../infrastructure/therapy-session.response';
import { SessionDetailPanel } from '../../components/session-detail-panel/session-detail-panel';
import { SessionHistoryTable } from '../../components/session-history-table/session-history-table';
import { TherapyChart, TherapyChartSeries } from '../../components/therapy-chart/therapy-chart';
import { TherapyLoadingSkeleton } from '../../components/therapy-loading-skeleton/therapy-loading-skeleton';
import { TrackingKpi, TrackingKpis } from '../../components/tracking-kpis/tracking-kpis';
import { TherapyDashboardBase, TherapyRoleContext } from '../shared/therapy-dashboard.base';

/**
 * One patient's therapy, in depth: history, ROM trend, and a drill-down into every repetition.
 *
 * <p>Read-only by design. This used to be an execution console (prepare → confirm hardware → start
 * → finalize), which duplicated the patient's mobile app and asked the clinician to attest, from
 * the clinic, that the sensors were on the patient's arm — something only the patient can know.
 * Meanwhile the thing that actually matters, seeing the history, was impossible.
 *
 * <p>Reached from the therapy index, which is where the caseload lives; keeping a patient list in
 * here as well cost the charts the width they need to be read.
 */
@Component({
  selector: 'app-therapy-tracking',
  imports: [
    TranslatePipe,
    RouterLink,
    ButtonModule,
    DrawerModule,
    TrackingKpis,
    SessionHistoryTable,
    SessionDetailPanel,
    TherapyChart,
    TherapyLoadingSkeleton,
  ],
  templateUrl: './therapy-tracking.html',
  styleUrl: './therapy-tracking.scss',
  // Scoped here so the polling dies with the view.
  providers: [TherapyLive],
})
export class TherapyTracking extends TherapyDashboardBase implements OnInit {
  protected readonly roleContext: TherapyRoleContext = 'physiotherapist';

  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly therapyLive = inject(TherapyLive);

  /** From the route: /physiotherapist/therapy/:patientId */
  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });
  protected readonly patientId = computed(() => this.routeParams().get('patientId') ?? '');

  /** Resolved from the caseload the page loads anyway; the API answers by id, not by name. */
  protected readonly patientName = computed(
    () => this.patients().find((patient) => patient.id === this.patientId())?.fullName ?? '',
  );

  protected readonly sessionHistory = this.therapySessionStore.sessionHistory;
  protected readonly isLoadingHistory = this.therapySessionStore.isLoadingHistory;

  /** True for the whole first init, not just the history call, so no zero-KPIs flash before it. */
  private readonly initializingSignal = signal(true);

  /**
   * Only the very first load shows the skeleton. A manual refresh keeps the current history on
   * screen while it reloads — replacing it with a skeleton would blank content the clinician is
   * already reading.
   */
  protected readonly isInitialLoad = computed(
    () => this.initializingSignal() || (this.isLoadingHistory() && !this.sessionHistory().length),
  );
  protected readonly selectedSessionId = this.therapySessionStore.selectedSessionId;
  protected readonly selectedSessionDetail = this.therapySessionStore.selectedSessionDetail;
  protected readonly isLoadingDetail = this.therapySessionStore.isLoadingDetail;

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

  /**
   * Weighted by repetition count, so every repetition carries the same weight as it does in the
   * backend's own average. A plain mean of the per-session means would let a 3-rep session sway the
   * figure as much as a 25-rep one, and the index and this page would quote different numbers for
   * the same patient.
   */
  private readonly averageRom = computed(() => {
    const sessions = this.romTrendSessions();
    const reps = sessions.reduce((total, session) => total + (session.totalRepetitions ?? 0), 0);
    if (!reps) return null;
    const weighted = sessions.reduce(
      (total, session) => total + session.averageAchievedRom! * (session.totalRepetitions ?? 0),
      0,
    );
    return weighted / reps;
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
        // The headline is the ratio, not the volume: the tone judges quality, and colouring the
        // repetition count red would read as "307 repetitions is bad", which it is not.
        labelKey: 'therapySessions.tracking.kpi.quality',
        value: goodRatio !== null ? `${Math.round(goodRatio * 100)}%` : '—',
        hint: this.translateService.instant('therapySessions.tracking.kpi.qualitySub', {
          good,
          total,
        }),
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
    await this.initializePatient(this.patientId());
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

  protected onRefresh() {
    void this.loadPatientWorkspace(this.patientId(), this.selectedDate());
  }

  private async initializePatient(patientId: string): Promise<void> {
    this.initializingSignal.set(true);
    try {
      await Promise.all([
        this.organizationStore.loadCurrentPhysiotherapistOnce(),
        this.organizationStore.loadMyPatients(),
        this.planningStore.loadExerciseCatalog(),
      ]);
      this.deviceStore.loadDevices();
      await this.loadPatientWorkspace(patientId, this.selectedDate());
      this.therapyLive.start(patientId);
    } finally {
      this.initializingSignal.set(false);
    }
  }

  protected override async loadPatientWorkspace(patientId: string, date?: string): Promise<void> {
    await super.loadPatientWorkspace(patientId, date);
    await this.therapySessionStore.loadSessionHistory(patientId);
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
