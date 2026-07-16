import { computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceStore } from '../../../../device/application/device.store';
import { Device } from '../../../../device/domain/model/device.entity';
import { IamStore } from '../../../../iam/application/iam.store';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { Patient } from '../../../../organization/domain/model/patient.entity';
import { PlanningStore } from '../../../../planning/application/planning.store';
import { TherapySessionStore } from '../../../application/therapy-session.store';
import {
  DailyScheduleResolutionStatus,
  TherapySerieStatus,
  TherapySessionStatus,
} from '../../../domain/model/therapy-session.types';

export type TherapyRoleContext = 'admin' | 'physiotherapist';

export abstract class TherapyDashboardBase {
  protected abstract readonly roleContext: TherapyRoleContext;

  protected readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);
  protected readonly organizationStore = inject(OrganizationStore);
  protected readonly planningStore = inject(PlanningStore);
  protected readonly deviceStore = inject(DeviceStore);
  protected readonly therapySessionStore = inject(TherapySessionStore);

  private readonly selectedDateSignal = signal(this.formatDateAsIso(new Date()));

  protected readonly selectedDate = this.selectedDateSignal.asReadonly();
  protected readonly patients = this.organizationStore.patients;
  protected readonly selectedPatientId = this.therapySessionStore.selectedPatientId;
  protected readonly selectedPatient = computed(
    () => this.patients().find((patient) => patient.id === this.selectedPatientId()) ?? null,
  );
  protected readonly activeSession = this.therapySessionStore.activeSession;
  protected readonly hasActiveSession = this.therapySessionStore.hasActiveSession;
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
  protected readonly treatmentPlans = this.planningStore.patientTreatmentPlans;
  protected readonly activeTreatmentPlan = computed(
    () =>
      this.treatmentPlans().find((plan) => plan.status === 'ACTIVE') ??
      this.treatmentPlans().find((plan) => plan.status === 'SCHEDULED') ??
      null,
  );
  protected readonly assignedPatientDevice = computed(
    () =>
      this.deviceStore
        .devices()
        .find((device) => device.currentPatientId === this.selectedPatientId()) ?? null,
  );
  protected readonly isPhysiotherapistPortal = computed(
    () =>
      this.roleContext === 'physiotherapist' ||
      this.currentRoleLabel().includes('ROLE_PHYSIOTHERAPIST'),
  );
  protected readonly isAdminPortal = computed(
    () => this.roleContext === 'admin' || this.currentRoleLabel().includes('ROLE_CLINIC_ADMIN'),
  );
  protected readonly titleKey = computed(() =>
    this.isAdminPortal() ? 'therapySessions.adminTitle' : 'therapySessions.tracking.title',
  );
  protected readonly subtitleKey = computed(() =>
    this.isAdminPortal() ? 'therapySessions.adminSubtitle' : 'therapySessions.tracking.subtitle',
  );
  protected readonly openPatientLabelKey = computed(() =>
    this.isAdminPortal()
      ? 'therapySessions.openAdminPatient'
      : 'therapySessions.openPhysiotherapistPatient',
  );
  protected readonly hasResolvedSchedule = computed(
    () => this.dailySchedule()?.resolutionStatus === 'FOUND',
  );
  protected readonly hasEmptySchedule = computed(() => !this.hasResolvedSchedule());
  protected readonly assignedProgramLabelKey = computed(() =>
    this.hasResolvedSchedule()
      ? 'therapySessions.programAssignedCustom'
      : 'therapySessions.programAssignedEmpty',
  );
  protected readonly scheduleResolutionLabelKey = computed(() =>
    this.scheduleResolutionStatusKey(this.dailySchedule()?.resolutionStatus ?? null),
  );
  protected readonly scheduleEmptyTitleKey = computed(() => {
    switch (this.dailySchedule()?.resolutionStatus ?? null) {
      case 'NO_ACTIVE_PLAN_FOR_DATE':
        return 'therapySessions.scheduleEmpty.noPlanTitle';
      case 'NO_ROUTINE_FOR_DAY':
        return 'therapySessions.scheduleEmpty.noRoutineTitle';
      default:
        return 'therapySessions.scheduleEmpty.unknownTitle';
    }
  });
  protected readonly scheduleEmptyMessageKey = computed(() => {
    switch (this.dailySchedule()?.resolutionStatus ?? null) {
      case 'NO_ACTIVE_PLAN_FOR_DATE':
        return 'therapySessions.scheduleEmpty.noPlanMessage';
      case 'NO_ROUTINE_FOR_DAY':
        return 'therapySessions.scheduleEmpty.noRoutineMessage';
      default:
        return 'therapySessions.scheduleEmpty.unknownMessage';
    }
  });
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

    return this.activeSession()?.requiresClinicalReview ?? false;
  });
  protected readonly clinicalReviewLabelKey = computed(() =>
    this.requiresClinicalReview()
      ? 'therapySessions.clinicalReviewRequired'
      : 'therapySessions.clinicalReviewNotRequired',
  );
  protected readonly hardwareStatusLabelKey = computed(() => {
    const session = this.activeSession();
    if (!session) return 'therapySessions.hardwareUnavailable';
    if (session.sensorsPlaced === true) return 'therapySessions.hardwareReady';
    if (session.sensorsPlaced === false) return 'therapySessions.hardwareNotReady';
    if (this.assignedPatientDevice()) return 'therapySessions.hardwareDeviceLinked';
    return 'therapySessions.hardwarePending';
  });
  protected readonly hardwareDeviceDisplayLabel = computed(() => {
    const assignedDevice = this.assignedPatientDevice();
    if (assignedDevice) {
      return this.deviceDisplayLabel(assignedDevice);
    }

    return this.activeSession()
      ? 'therapySessions.hardwareDeviceLinked'
      : 'therapySessions.hardwareUnavailable';
  });
  protected readonly activeSessionDeviceLabel = computed(() => {
    const session = this.activeSession();
    if (!session) return 'therapySessions.hardwareUnavailable';
    const device = this.deviceForSerial(session.iotDeviceId);
    return device ? this.deviceDisplayLabel(device) : session.iotDeviceId;
  });
  protected readonly responsibleSpecialistLabel = computed(() => {
    const physiotherapist = this.currentPhysiotherapist();
    if (physiotherapist) return physiotherapist.fullName;
    return this.roleContext === 'admin'
      ? 'therapySessions.responsibleSpecialistFallbackAdmin'
      : 'therapySessions.responsibleSpecialistFallback';
  });
  protected readonly progressCompletedSeries = computed(
    () => this.sessionProgress()?.completedSeries ?? 0,
  );
  protected readonly progressTotalSeries = computed(() => this.sessionProgress()?.totalSeries ?? 0);
  protected readonly progressCompletionLabel = computed(
    () => `${this.progressCompletedSeries()} / ${this.progressTotalSeries()}`,
  );

  protected async initializeDashboard(): Promise<void> {
    this.deviceStore.loadDevices();

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
      await this.loadPatientWorkspace(firstPatient.id, this.selectedDate());
      return;
    }

    this.therapySessionStore.clearSelection();
  }

  protected async loadPatientWorkspace(patientId: string, date?: string): Promise<void> {
    await Promise.all([
      this.therapySessionStore.loadPatientContext(patientId, date),
      this.planningStore.loadTreatmentPlansByPatient(patientId),
    ]);
  }

  protected onSelectPatient(patient: Patient) {
    void this.loadPatientWorkspace(patient.id, this.selectedDate());
  }

  protected onRefreshPatientContext() {
    const patientId = this.selectedPatientId();
    if (!patientId) return;
    void this.loadPatientWorkspace(patientId, this.selectedDate());
  }

  protected onSelectedDateChange(value: string) {
    this.selectedDateSignal.set(value || this.formatDateAsIso(new Date()));
    const patientId = this.selectedPatientId();
    if (!patientId) return;
    void this.loadPatientWorkspace(patientId, this.selectedDate());
  }

  protected onSelectedDateInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.onSelectedDateChange(input?.value ?? '');
  }

  protected onJumpToToday() {
    const today = this.formatDateAsIso(new Date());
    this.selectedDateSignal.set(today);
    const patientId = this.selectedPatientId();
    if (!patientId) return;
    void this.loadPatientWorkspace(patientId, today);
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

  protected sessionStatusKey(status: TherapySessionStatus | null): string {
    return `therapySessions.statuses.session.${status ?? 'Unknown'}`;
  }

  protected serieStatusKey(status: TherapySerieStatus | null): string {
    return `therapySessions.statuses.serie.${status ?? 'Unknown'}`;
  }

  protected scheduleResolutionStatusKey(status: DailyScheduleResolutionStatus | null): string {
    return `therapySessions.scheduleResolution.${status ?? 'UNKNOWN'}`;
  }

  protected isTranslatableValue(value: string): boolean {
    return value.startsWith('therapySessions.');
  }

  protected deviceDisplayLabel(device: Device): string {
    return (
      device.advertisedName ??
      device.serialNumber ??
      device.model ??
      'therapySessions.hardwareDeviceLinked'
    );
  }

  /**
   * A session's `iotDeviceId` is the kit serial (the cross-service identity), not the backend
   * Device UUID — matching it against `device.id` never hits.
   */
  protected deviceForSerial(serial: string | null): Device | null {
    if (!serial) return null;
    return this.deviceStore.devices().find((device) => device.serialNumber === serial) ?? null;
  }

  protected activeSessionCardDeviceLabel(): string {
    return this.hardwareDeviceDisplayLabel();
  }

  protected serieLabel(serieId: string, index: number): string {
    const progress = this.sessionProgress();
    const serie = progress?.seriesProgress[index] ?? null;
    return this.serieLabelForIndex(index, serieId, serie?.exerciseId ?? null);
  }

  private formatDateAsIso(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
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

    return 'therapySessions.operations.stepper.valueUnassigned';
  }
}
