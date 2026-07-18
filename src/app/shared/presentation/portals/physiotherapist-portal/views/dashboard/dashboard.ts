import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../../../../organization/application/organization.store';
import { PlanningStore } from '../../../../../../planning/application/planning.store';
import { TherapySessionStore } from '../../../../../../therapy/application/therapy-session.store';

type KpiTone = 'neutral' | 'good' | 'warn' | 'danger';
type AttentionState = 'live' | 'review' | 'idle';

interface AttentionRow {
  patientId: string;
  name: string;
  state: AttentionState;
  reviewCount: number;
  lastSessionAt: string | null;
  qualityRatio: number | null;
  rom: number | null;
}

interface AgendaRow {
  patientId: string;
  planId: string;
  patientName: string;
  routineName: string;
  time: string;
}

/** Maps JS Date.getDay() (0=Sunday) to the backend day-of-week enum. */
const WEEKDAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

/** Attention rows sort by clinical urgency: live first, then review, then idle. */
const STATE_PRIORITY: Record<AttentionState, number> = { live: 0, review: 1, idle: 2 };

/**
 * Physiotherapist dashboard. The clinician's daily landing page, built
 * entirely from live data: the caseload roster (Organization), treatment
 * plans (Planning), and per-patient therapy standing (Therapy). It
 * surfaces who needs attention right now and what is scheduled today.
 */
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe, TranslatePipe, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly therapyStore = inject(TherapySessionStore);

  protected readonly physiotherapist = this.organizationStore.currentPhysiotherapist;
  protected readonly activePatients = this.organizationStore.inTreatmentPatientsCount;
  protected readonly isLoading = computed(
    () =>
      this.organizationStore.isLoadingPatients() ||
      this.planningStore.isLoadingAllTreatmentPlans() ||
      this.therapyStore.isLoadingOverview(),
  );

  private readonly overview = this.therapyStore.patientOverview;
  private readonly plans = this.planningStore.allTreatmentPlans;

  protected readonly firstName = computed(() => {
    const full = this.physiotherapist()?.fullName?.trim() ?? '';
    return full ? full.split(' ')[0] : '';
  });

  protected readonly greetingKey = computed(() => {
    const hour = new Date().getHours();
    const period = hour < 12 ? 'morning' : hour < 19 ? 'afternoon' : 'evening';
    // Fall back to a name-less greeting until the profile resolves.
    const suffix = this.firstName() ? 'Named' : '';
    return `physiotherapist.dashboard.greeting.${period}${suffix}`;
  });

  protected readonly inSessionCount = computed(
    () => this.overview().filter((row) => row.hasActiveSession).length,
  );
  protected readonly needsReviewCount = computed(() =>
    this.overview().reduce((total, row) => total + (row.sessionsRequiringReview ?? 0), 0),
  );
  protected readonly activePlansCount = computed(
    () => this.plans().filter((plan) => plan.status === 'ACTIVE').length,
  );
  protected readonly scheduledPlansCount = computed(
    () => this.plans().filter((plan) => plan.status === 'SCHEDULED').length,
  );
  protected readonly completedPlansCount = computed(
    () => this.plans().filter((plan) => plan.status === 'COMPLETED').length,
  );
  protected readonly totalPlansCount = computed(() => this.plans().length);

  /** Overall movement quality across the caseload: good vs. total repetitions. */
  protected readonly qualityRatio = computed(() => {
    const rows = this.overview();
    const total = rows.reduce((sum, row) => sum + (row.totalRepetitions ?? 0), 0);
    if (!total) return null;
    const good = rows.reduce((sum, row) => sum + (row.goodRepetitions ?? 0), 0);
    return good / total;
  });

  protected readonly qualityLabel = computed(() => {
    const ratio = this.qualityRatio();
    return ratio === null ? '—' : `${Math.round(ratio * 100)}%`;
  });

  protected readonly inSessionTone = computed<KpiTone>(() =>
    this.inSessionCount() > 0 ? 'good' : 'neutral',
  );
  protected readonly needsReviewTone = computed<KpiTone>(() =>
    this.needsReviewCount() > 0 ? 'danger' : 'neutral',
  );
  protected readonly qualityTone = computed<KpiTone>(() => this.toneForRatio(this.qualityRatio()));

  /** Patients who need the clinician now: in a live session, awaiting review, or never started. */
  protected readonly attentionRows = computed<AttentionRow[]>(() => {
    const rows: AttentionRow[] = [];
    for (const row of this.overview()) {
      const reviewCount = row.sessionsRequiringReview ?? 0;
      let state: AttentionState | null = null;
      if (row.hasActiveSession) state = 'live';
      else if (reviewCount > 0) state = 'review';
      else if (row.lastSessionAt === null) state = 'idle';
      if (!state) continue;

      rows.push({
        patientId: row.patientId,
        name: row.patientFullName ?? row.patientId,
        state,
        reviewCount,
        lastSessionAt: row.lastSessionAt,
        qualityRatio: this.ratioOf(row.goodRepetitions, row.totalRepetitions),
        rom: row.averageAchievedRom,
      });
    }
    return rows.sort(
      (a, b) => STATE_PRIORITY[a.state] - STATE_PRIORITY[b.state] || b.reviewCount - a.reviewCount,
    );
  });

  /** Routines from active plans scheduled for today, earliest first. */
  protected readonly agendaRows = computed<AgendaRow[]>(() => {
    const today = WEEKDAYS[new Date().getDay()];
    const names = new Map(this.organizationStore.patients().map((p) => [p.id, p.fullName]));
    const rows: AgendaRow[] = [];
    for (const plan of this.plans()) {
      if (plan.status !== 'ACTIVE') continue;
      for (const routine of plan.routines) {
        if (routine.schedule?.dayOfWeek !== today) continue;
        rows.push({
          patientId: plan.patientId,
          planId: plan.id,
          patientName: names.get(plan.patientId) ?? plan.patientId,
          routineName: routine.name,
          time: routine.schedule.scheduledTime ?? '',
        });
      }
    }
    return rows.sort((a, b) => a.time.localeCompare(b.time));
  });

  async ngOnInit(): Promise<void> {
    const physiotherapist = await this.organizationStore.loadCurrentPhysiotherapistOnce();
    await Promise.all([
      this.organizationStore.loadMyPatients(),
      this.planningStore.loadAllTreatmentPlans(
        physiotherapist ? { physiotherapistId: physiotherapist.id } : undefined,
      ),
      this.therapyStore.loadPatientOverview(),
    ]);
  }

  protected onRegisterPatient(): void {
    void this.router.navigate(['/physiotherapist/patients/new']);
  }

  protected onViewAllPatients(): void {
    void this.router.navigate(['/physiotherapist/patients']);
  }

  protected onViewPlanning(): void {
    void this.router.navigate(['/physiotherapist/planning']);
  }

  protected onOpenPatientTherapy(patientId: string): void {
    void this.router.navigate(['/physiotherapist/therapy', patientId]);
  }

  protected onOpenAgendaPlan(row: AgendaRow): void {
    void this.router.navigate([
      '/physiotherapist/planning',
      row.patientId,
      'treatment-plans',
      row.planId,
    ]);
  }

  protected initials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    return `${parts[0]?.charAt(0) ?? '?'}${parts[1]?.charAt(0) ?? ''}`.toUpperCase();
  }

  protected romLabel(rom: number | null): string {
    return rom !== null ? `${rom.toFixed(1)}°` : '—';
  }

  protected toneForRatio(ratio: number | null): KpiTone {
    if (ratio === null) return 'neutral';
    if (ratio >= 0.7) return 'good';
    if (ratio >= 0.3) return 'warn';
    return 'danger';
  }

  /** Percentage width for a plan-mix bar segment; 0 when there are no plans. */
  protected planShare(count: number): number {
    const total = this.totalPlansCount();
    return total ? (count / total) * 100 : 0;
  }

  private ratioOf(good: number | null, total: number | null): number | null {
    if (!total) return null;
    return (good ?? 0) / total;
  }
}
