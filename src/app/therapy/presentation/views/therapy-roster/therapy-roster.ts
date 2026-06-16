import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { IamStore } from '../../../../iam/application/iam.store';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { Patient } from '../../../../organization/domain/model/patient.entity';
import { PlanningStore } from '../../../../planning/application/planning.store';
import { TherapySessionStore } from '../../../application/therapy-session.store';
import {
  TherapySerieStatus,
  TherapySessionStatus,
} from '../../../domain/model/therapy-session.types';

type TherapyRoleContext = 'admin' | 'physiotherapist';

/**
 * Shared Therapy sessions landing for clinic-admin and physiotherapist.
 * The role decides which patient roster is loaded, while the detail
 * pane is backed by the TherapySession API contracts.
 */
@Component({
  selector: 'app-therapy-roster',
  imports: [TranslatePipe, ButtonModule, DatePipe],
  templateUrl: './therapy-roster.html',
  styleUrl: './therapy-roster.scss',
})
export class TherapyRoster implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly therapySessionStore = inject(TherapySessionStore);

  private readonly roleContext =
    (this.route.snapshot.data['roleContext'] as TherapyRoleContext) ?? 'physiotherapist';

  protected readonly patients = this.organizationStore.patients;
  protected readonly selectedPatientId = this.therapySessionStore.selectedPatientId;
  protected readonly selectedPatient = computed(
    () => this.patients().find((patient) => patient.id === this.selectedPatientId()) ?? null,
  );
  protected readonly activeSession = this.therapySessionStore.activeSession;
  protected readonly dailySchedule = this.therapySessionStore.dailySchedule;
  protected readonly sessionProgress = this.therapySessionStore.sessionProgress;
  protected readonly isLoadingPatients = this.organizationStore.isLoadingPatients;
  protected readonly isLoadingPatientContext = this.therapySessionStore.isLoadingPatientContext;
  protected readonly contextError = this.therapySessionStore.contextError;
  protected readonly inTreatmentPatientsCount = this.organizationStore.inTreatmentPatientsCount;
  protected readonly currentClinic = this.organizationStore.currentClinic;
  protected readonly currentPhysiotherapist = this.organizationStore.currentPhysiotherapist;
  protected readonly currentRoleLabel = this.iamStore.currentRoles;
  protected readonly exerciseCatalog = this.planningStore.exerciseCatalog;
  protected readonly hasAssignedRoutine = computed(() => this.dailySchedule()?.routineId !== null);
  protected readonly currentSerieLabel = computed(() => {
    const progress = this.sessionProgress();
    if (!progress?.currentSerieId) return '—';

    const serieIndex = progress.seriesProgress.findIndex(
      (serie) => serie.serieId === progress.currentSerieId,
    );
    const currentSerie = progress.seriesProgress[serieIndex] ?? null;

    return this.serieLabelForIndex(
      serieIndex,
      progress.currentSerieId,
      currentSerie?.exerciseId ?? null,
    );
  });
  protected readonly activeSessionLabel = computed(() => {
    const session = this.activeSession();
    const patient = this.selectedPatient();
    if (!session) return '—';

    const dateLabel = session.startedAt?.slice(0, 10) ?? this.dailySchedule()?.date ?? null;
    if (patient && dateLabel) {
      return `${patient.firstName} · ${dateLabel}`;
    }
    if (patient) {
      return patient.fullName;
    }
    return dateLabel ? `Session · ${dateLabel}` : 'Active session';
  });
  protected readonly assignedProgramLabelKey = computed(() =>
    this.hasAssignedRoutine()
      ? 'therapySessions.programAssignedCustom'
      : 'therapySessions.programAssignedEmpty',
  );
  protected readonly currentPainLevelLabel = computed(() => {
    const progressPainLevel = this.sessionProgress()?.painLevel ?? null;
    if (progressPainLevel !== null) return String(progressPainLevel);

    const sessionPainLevel = this.activeSession()?.painLevel ?? null;
    if (sessionPainLevel !== null) return String(sessionPainLevel);

    return this.activeSession()
      ? 'therapySessions.painLevelPending'
      : 'therapySessions.painLevelUnavailable';
  });
  protected readonly requiresClinicalReview = computed(() => {
    const progressRequiresReview = this.sessionProgress()?.requiresClinicalReview;
    if (progressRequiresReview !== null && progressRequiresReview !== undefined) {
      return progressRequiresReview;
    }

    const sessionRequiresReview = this.activeSession()?.requiresClinicalReview;
    return sessionRequiresReview ?? false;
  });
  protected readonly clinicalReviewLabelKey = computed(() =>
    this.requiresClinicalReview()
      ? 'therapySessions.clinicalReviewRequired'
      : 'therapySessions.clinicalReviewNotRequired',
  );
  protected readonly hardwareStatusLabelKey = computed(() => {
    const session = this.activeSession();
    if (!session) return 'therapySessions.hardwareUnavailable';
    if (session.status === 'Pending') return 'therapySessions.hardwarePending';
    if (
      session.status === 'Ready' ||
      session.status === 'InProgress' ||
      session.status === 'Completed'
    ) {
      return 'therapySessions.hardwareConnected';
    }
    return 'therapySessions.hardwareUnavailable';
  });
  protected readonly responsibleSpecialistLabel = computed(() => {
    const physiotherapist = this.currentPhysiotherapist();
    if (physiotherapist) return physiotherapist.fullName;
    return this.roleContext === 'admin'
      ? 'therapySessions.responsibleSpecialistFallbackAdmin'
      : 'therapySessions.responsibleSpecialistFallback';
  });
  protected readonly hasEmptySchedule = computed(() => {
    const schedule = this.dailySchedule();
    if (!schedule) return true;
    return schedule.totalSeries === 0 && schedule.estimatedDurationMinutes === 0;
  });

  protected readonly titleKey = computed(() =>
    this.roleContext === 'admin'
      ? 'therapySessions.adminTitle'
      : 'therapySessions.physiotherapistTitle',
  );
  protected readonly subtitleKey = computed(() =>
    this.roleContext === 'admin'
      ? 'therapySessions.adminSubtitle'
      : 'therapySessions.physiotherapistSubtitle',
  );
  protected readonly openPatientLabelKey = computed(() =>
    this.roleContext === 'admin'
      ? 'therapySessions.openAdminPatient'
      : 'therapySessions.openPhysiotherapistPatient',
  );

  async ngOnInit(): Promise<void> {
    if (this.roleContext === 'admin') {
      await Promise.all([
        this.organizationStore.loadCurrentClinicOnce(),
        this.organizationStore.loadClinicPatients(),
        this.planningStore.loadExerciseCatalog(),
      ]);
    } else {
      await Promise.all([
        this.organizationStore.loadCurrentPhysiotherapistOnce(),
        this.organizationStore.loadMyPatients(),
        this.planningStore.loadExerciseCatalog(),
      ]);
    }

    const firstPatient = this.patients()[0] ?? null;
    if (firstPatient) {
      await this.therapySessionStore.loadPatientContext(firstPatient.id);
      return;
    }

    this.therapySessionStore.clearSelection();
  }

  protected onSelectPatient(patient: Patient) {
    void this.therapySessionStore.loadPatientContext(patient.id);
  }

  protected onRefreshPatientContext() {
    const patientId = this.selectedPatientId();
    if (!patientId) return;
    void this.therapySessionStore.loadPatientContext(patientId);
  }

  protected onOpenPatient() {
    const patient = this.selectedPatient();
    if (!patient) return;

    const route =
      this.roleContext === 'admin'
        ? ['/clinic-admin/organization/patients', patient.id]
        : ['/physiotherapist/patients', patient.id];

    void this.router.navigate(route);
  }

  protected patientDisplayName(patient: Patient): string {
    return patient.fullName;
  }

  protected initials(patient: Patient): string {
    return `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase();
  }

  protected hasSelectedPatient(patientId: string): boolean {
    return this.selectedPatientId() === patientId;
  }

  protected serieLabel(serieId: string, index: number): string {
    const progress = this.sessionProgress();
    const serie = progress?.seriesProgress[index] ?? null;
    return this.serieLabelForIndex(index, serieId, serie?.exerciseId ?? null);
  }

  protected sessionStatusKey(status: TherapySessionStatus | null): string {
    return `therapySessions.statuses.session.${status ?? 'Unknown'}`;
  }

  protected serieStatusKey(status: TherapySerieStatus | null): string {
    return `therapySessions.statuses.serie.${status ?? 'Unknown'}`;
  }

  protected isTranslatableValue(value: string): boolean {
    return value.startsWith('therapySessions.');
  }

  private serieLabelForIndex(index: number, fallbackId: string, exerciseId: string | null): string {
    if (exerciseId) {
      const exercise = this.exerciseCatalog().find((item) => item.id === exerciseId);
      if (exercise) {
        return exercise.name;
      }
    }

    if (index >= 0) {
      return `Serie ${index + 1}`;
    }

    const shortReference = fallbackId.slice(-4).toUpperCase();
    return `Serie ${shortReference}`;
  }
}
