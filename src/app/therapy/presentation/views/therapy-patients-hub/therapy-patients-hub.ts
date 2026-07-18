import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SearchInput } from '../../../../shared/presentation/components/search-input/search-input';
import { TherapySessionStore } from '../../../application/therapy-session.store';
import { PatientTherapyOverviewResource } from '../../../infrastructure/therapy-session.response';
import { TherapyLoadingSkeleton } from '../../components/therapy-loading-skeleton/therapy-loading-skeleton';
import { TrackingKpi, TrackingKpis } from '../../components/tracking-kpis/tracking-kpis';

/**
 * Slow on purpose: this only answers "did someone start or finish a session", which changes on a
 * human timescale. The per-repetition detail lives one click away, where polling is fast.
 */
const OVERVIEW_REFRESH_MS = 30_000;

/**
 * The physiotherapist's therapy index: which of their patients need attention, and who to open.
 *
 * <p>Every column here is about therapy — last session, volume, quality, ROM, alerts. Identity and
 * contact details deliberately live in /physiotherapist/patients; repeating them would make this
 * the same table twice.
 *
 * <p>One request feeds the whole list: the backend aggregates per patient. Asking per patient would
 * be a request each.
 */
@Component({
  selector: 'app-therapy-patients-hub',
  imports: [
    TranslatePipe,
    DatePipe,
    ButtonModule,
    SearchInput,
    TrackingKpis,
    TherapyLoadingSkeleton,
  ],
  templateUrl: './therapy-patients-hub.html',
  styleUrl: './therapy-patients-hub.scss',
})
export class TherapyPatientsHub implements OnInit {
  private readonly router = inject(Router);
  private readonly therapySessionStore = inject(TherapySessionStore);

  protected readonly overview = this.therapySessionStore.patientOverview;
  protected readonly isLoading = this.therapySessionStore.isLoadingOverview;
  protected readonly loadError = this.therapySessionStore.overviewError;

  private readonly querySignal = signal('');
  protected readonly query = this.querySignal.asReadonly();

  protected readonly filteredPatients = computed(() => {
    const query = this.querySignal().trim().toLowerCase();
    if (!query) return this.overview();
    return this.overview().filter((row) =>
      (row.patientFullName ?? '').toLowerCase().includes(query),
    );
  });

  protected readonly showSearch = computed(() => this.overview().length > 5);

  protected readonly kpis = computed<TrackingKpi[]>(() => {
    const rows = this.overview();
    const inSession = rows.filter((row) => row.hasActiveSession).length;
    const needReview = rows.reduce((total, row) => total + (row.sessionsRequiringReview ?? 0), 0);
    const neverStarted = rows.filter((row) => row.lastSessionAt === null).length;

    return [
      {
        labelKey: 'therapySessions.hub.kpi.caseload',
        value: `${rows.length}`,
        hint: '',
        tone: 'neutral',
      },
      {
        labelKey: 'therapySessions.hub.kpi.inSession',
        value: `${inSession}`,
        hint: '',
        tone: inSession > 0 ? 'good' : 'neutral',
      },
      {
        labelKey: 'therapySessions.hub.kpi.neverStarted',
        value: `${neverStarted}`,
        hint: '',
        tone: neverStarted > 0 ? 'warn' : 'neutral',
      },
      {
        labelKey: 'therapySessions.hub.kpi.needReview',
        value: `${needReview}`,
        hint: '',
        tone: needReview > 0 ? 'danger' : 'neutral',
      },
    ];
  });

  constructor() {
    // Keeps the live markers honest without the clinician reaching for a refresh button. Silent, so
    // the table never blanks under them; paused while the tab is hidden.
    const intervalId = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      void this.therapySessionStore.loadPatientOverview({ silent: true });
    }, OVERVIEW_REFRESH_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }

  async ngOnInit(): Promise<void> {
    await this.therapySessionStore.loadPatientOverview();
  }

  protected onOpenPatient(row: PatientTherapyOverviewResource) {
    void this.router.navigate(['/physiotherapist/therapy', row.patientId]);
  }

  protected onQueryChange(value: string) {
    this.querySignal.set(value);
  }

  protected initials(row: PatientTherapyOverviewResource): string {
    const parts = (row.patientFullName ?? '?').split(' ').filter(Boolean);
    return `${parts[0]?.charAt(0) ?? '?'}${parts[1]?.charAt(0) ?? ''}`.toUpperCase();
  }

  protected romLabel(row: PatientTherapyOverviewResource): string {
    return row.averageAchievedRom !== null ? `${row.averageAchievedRom.toFixed(1)}°` : '—';
  }

  /** Share of repetitions the edge classified as Good; the gap is the clinical signal. */
  protected qualityRatio(row: PatientTherapyOverviewResource): number | null {
    const total = row.totalRepetitions ?? 0;
    if (!total) return null;
    return (row.goodRepetitions ?? 0) / total;
  }

  protected qualityTone(row: PatientTherapyOverviewResource): string {
    const ratio = this.qualityRatio(row);
    if (ratio === null) return 'empty';
    if (ratio >= 0.7) return 'good';
    if (ratio >= 0.3) return 'warn';
    return 'danger';
  }
}
