import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormField, form, readonly, required, submit } from '@angular/forms/signals';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { CancelTherapySessionCommand } from '../../../domain/model/cancel-therapy-session.command';
import { ConfirmHardwareReadinessCommand } from '../../../domain/model/confirm-hardware-readiness.command';
import { InitiateTherapyPreparationCommand } from '../../../domain/model/initiate-therapy-preparation.command';
import { TherapySessionStatus } from '../../../domain/model/therapy-session.types';
import { TherapyApi } from '../../../infrastructure/therapy-api';
import { TherapyDashboardBase, TherapyRoleContext } from '../shared/therapy-dashboard.base';

@Component({
  selector: 'app-therapy-operations',
  imports: [TranslatePipe, ButtonModule, DatePipe, FormField],
  templateUrl: './therapy-operations.html',
  styleUrl: './therapy-operations.scss',
})
export class TherapyOperations extends TherapyDashboardBase implements OnInit {
  protected readonly roleContext: TherapyRoleContext = 'physiotherapist';

  private readonly therapyApi = inject(TherapyApi);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  private readonly preparingSessionSignal = signal(false);
  private readonly confirmingHardwareSignal = signal(false);
  private readonly startingSessionSignal = signal(false);
  private readonly finalizingSessionSignal = signal(false);
  private readonly cancelingSessionSignal = signal(false);
  private readonly preparationModel = signal({
    treatmentPlanId: '',
    iotDeviceId: '',
    routineId: '',
  });
  private readonly hardwareModel = signal({
    deviceId: '',
    sensorsPlaced: false,
  });
  private readonly cancelModel = signal({
    reason: '',
  });

  protected readonly preparationForm = form(this.preparationModel, (schemaPath) => {
    required(schemaPath.treatmentPlanId, {
      message: 'therapySessions.validation.treatmentPlanRequired',
    });
    required(schemaPath.iotDeviceId, {
      message: 'therapySessions.validation.deviceRequired',
    });
    required(schemaPath.routineId, {
      message: 'therapySessions.validation.routineRequired',
    });
    readonly(schemaPath.treatmentPlanId);
    readonly(schemaPath.iotDeviceId);
    readonly(schemaPath.routineId);
  });
  protected readonly hardwareForm = form(this.hardwareModel, (schemaPath) => {
    required(schemaPath.deviceId, {
      message: 'therapySessions.validation.deviceRequired',
    });
    readonly(schemaPath.deviceId);
  });
  protected readonly cancelForm = form(this.cancelModel, (schemaPath) => {
    required(schemaPath.reason, {
      message: 'therapySessions.validation.cancelReasonRequired',
    });
  });

  protected readonly isPreparingSession = this.preparingSessionSignal.asReadonly();
  protected readonly isConfirmingHardware = this.confirmingHardwareSignal.asReadonly();
  protected readonly isStartingSession = this.startingSessionSignal.asReadonly();
  protected readonly isFinalizingSession = this.finalizingSessionSignal.asReadonly();
  protected readonly isCancelingSession = this.cancelingSessionSignal.asReadonly();

  protected readonly preparationAvailabilityKey = computed(() => {
    if (this.activeSession()) return 'therapySessions.preparationBlockedActiveSession';
    if (!this.activeTreatmentPlan()) return 'therapySessions.preparationMissingPlan';
    if (!this.assignedPatientDevice()) return 'therapySessions.preparationMissingDevice';
    if (!this.dailySchedule()?.routineId) return 'therapySessions.preparationMissingRoutine';
    return 'therapySessions.preparationReady';
  });
  protected readonly canPrepareSession = computed(
    () =>
      this.activeSession() === null &&
      this.activeTreatmentPlan() !== null &&
      this.assignedPatientDevice() !== null &&
      this.dailySchedule()?.routineId !== null,
  );
  protected readonly canConfirmHardware = computed(
    () => this.activeSession() !== null && this.hardwareModel().deviceId !== '',
  );
  protected readonly canStartSession = computed(() => {
    const session = this.activeSession();
    return session?.status === 'Pending' || session?.status === 'Ready';
  });
  protected readonly canFinalizeSession = computed(() => {
    const status = this.activeSession()?.status;
    return status === 'Ready' || status === 'InProgress';
  });
  protected readonly canCancelSession = computed(() => this.activeSession() !== null);
  protected readonly canOpenPreparationWorkspace = computed(() => this.selectedPatient() !== null);
  protected readonly sessionStatus = computed<TherapySessionStatus | null>(
    () => this.activeSession()?.status ?? null,
  );
  protected readonly activeStep = computed<1 | 2 | 3 | 4>(() => {
    switch (this.sessionStatus()) {
      case 'Pending':
        return 2;
      case 'Ready':
        return 3;
      case 'InProgress':
      case 'Completed':
      case 'Cancelled':
        return 4;
      default:
        return 1;
    }
  });
  protected readonly stepperSteps = [
    { index: 1, labelKey: 'therapySessions.operations.stepper.step1Title' },
    { index: 2, labelKey: 'therapySessions.operations.stepper.step2Title' },
    { index: 3, labelKey: 'therapySessions.operations.stepper.step3Title' },
    { index: 4, labelKey: 'therapySessions.operations.stepper.step4Title' },
  ] as const;
  protected readonly treatmentPlanLabel = computed(
    () => this.activeTreatmentPlan()?.name ?? 'therapySessions.operations.stepper.valueUnassigned',
  );
  protected readonly routineLabel = computed(() => {
    const routineId = this.dailySchedule()?.routineId ?? null;
    const routine = routineId
      ? (this.activeTreatmentPlan()?.routines.find((item) => item.id === routineId) ?? null)
      : null;
    return routine?.name ?? 'therapySessions.operations.stepper.valueUnassigned';
  });
  protected readonly deviceLabel = computed(() => {
    const device = this.assignedPatientDevice();
    return device ? this.deviceDisplayLabel(device) : 'therapySessions.operations.stepper.valueUnassigned';
  });

  constructor() {
    super();

    effect(() => {
      const treatmentPlanId = this.activeTreatmentPlan()?.id ?? '';
      const iotDeviceId = this.assignedPatientDevice()?.id ?? '';
      const routineId = this.dailySchedule()?.routineId ?? '';
      const currentPreparation = this.preparationModel();
      if (
        currentPreparation.treatmentPlanId !== treatmentPlanId ||
        currentPreparation.iotDeviceId !== iotDeviceId ||
        currentPreparation.routineId !== routineId
      ) {
        this.preparationModel.set({ treatmentPlanId, iotDeviceId, routineId });
      }
    });

    effect(() => {
      const deviceId =
        this.activeSession()?.snapshotDeviceId ??
        this.activeSession()?.iotDeviceId ??
        this.assignedPatientDevice()?.id ??
        '';
      const sensorsPlaced = this.activeSession()?.snapshotSensorsPlaced ?? false;
      const currentHardware = untracked(() => this.hardwareModel());
      if (
        currentHardware.deviceId !== deviceId ||
        currentHardware.sensorsPlaced !== sensorsPlaced
      ) {
        this.hardwareModel.set({ deviceId, sensorsPlaced });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeDashboard();
  }

  protected onOpenPreparationWorkspace() {
    const patient = this.selectedPatient();
    if (!patient) return;
    void this.router.navigate(['/physiotherapist/patients', patient.id]);
  }

  protected onPrepareSession() {
    const patient = this.selectedPatient();
    if (!patient) return;

    submit(this.preparationForm, async () => {
      this.preparingSessionSignal.set(true);
      try {
        await firstValueFrom(
          this.therapyApi.initiatePreparation(
            new InitiateTherapyPreparationCommand({
              patientId: patient.id,
              treatmentPlanId: this.preparationModel().treatmentPlanId,
              iotDeviceId: this.preparationModel().iotDeviceId,
              routineId: this.preparationModel().routineId,
            }),
          ),
        );
        await this.loadPatientWorkspace(patient.id, this.selectedDate());
        this.notifySuccess(
          'therapySessions.notifications.prepareSuccessSummary',
          'therapySessions.notifications.prepareSuccessDetail',
        );
      } catch {
        this.notifyError(
          'therapySessions.notifications.prepareErrorSummary',
          'therapySessions.notifications.prepareErrorDetail',
        );
      } finally {
        this.preparingSessionSignal.set(false);
      }
    });
  }

  protected onConfirmHardware() {
    const session = this.activeSession();
    const patientId = this.selectedPatientId();
    if (!session || !patientId) return;

    submit(this.hardwareForm, async () => {
      this.confirmingHardwareSignal.set(true);
      try {
        await firstValueFrom(
          this.therapyApi.confirmHardwareReadiness(
            session.id,
            new ConfirmHardwareReadinessCommand({
              deviceId: this.hardwareModel().deviceId,
              sensorsPlaced: this.hardwareModel().sensorsPlaced,
            }),
          ),
        );
        await this.loadPatientWorkspace(patientId, this.selectedDate());
        this.notifySuccess(
          'therapySessions.notifications.hardwareSuccessSummary',
          'therapySessions.notifications.hardwareSuccessDetail',
        );
      } catch {
        this.notifyError(
          'therapySessions.notifications.hardwareErrorSummary',
          'therapySessions.notifications.hardwareErrorDetail',
        );
      } finally {
        this.confirmingHardwareSignal.set(false);
      }
    });
  }

  protected async onStartSession(): Promise<void> {
    const session = this.activeSession();
    const patientId = this.selectedPatientId();
    if (!session || !patientId || !this.canStartSession()) return;

    this.startingSessionSignal.set(true);
    try {
      await firstValueFrom(this.therapyApi.start(session.id));
      await this.loadPatientWorkspace(patientId, this.selectedDate());
      this.notifySuccess(
        'therapySessions.notifications.startSuccessSummary',
        'therapySessions.notifications.startSuccessDetail',
      );
    } catch {
      this.notifyError(
        'therapySessions.notifications.startErrorSummary',
        'therapySessions.notifications.startErrorDetail',
      );
    } finally {
      this.startingSessionSignal.set(false);
    }
  }

  protected async onFinalizeSession(): Promise<void> {
    const session = this.activeSession();
    const patientId = this.selectedPatientId();
    if (!session || !patientId || !this.canFinalizeSession()) return;

    this.finalizingSessionSignal.set(true);
    try {
      await firstValueFrom(this.therapyApi.finalize(session.id));
      await this.loadPatientWorkspace(patientId, this.selectedDate());
      this.notifySuccess(
        'therapySessions.notifications.finalizeSuccessSummary',
        'therapySessions.notifications.finalizeSuccessDetail',
      );
    } catch {
      this.notifyError(
        'therapySessions.notifications.finalizeErrorSummary',
        'therapySessions.notifications.finalizeErrorDetail',
      );
    } finally {
      this.finalizingSessionSignal.set(false);
    }
  }

  protected onCancelSession() {
    const session = this.activeSession();
    const patientId = this.selectedPatientId();
    if (!session || !patientId || !this.canCancelSession()) return;

    submit(this.cancelForm, async () => {
      this.cancelingSessionSignal.set(true);
      try {
        await firstValueFrom(
          this.therapyApi.cancel(
            session.id,
            new CancelTherapySessionCommand({ reason: this.cancelModel().reason }),
          ),
        );
        this.cancelModel.set({ reason: '' });
        await this.loadPatientWorkspace(patientId, this.selectedDate());
        this.notifySuccess(
          'therapySessions.notifications.cancelSuccessSummary',
          'therapySessions.notifications.cancelSuccessDetail',
        );
      } catch {
        this.notifyError(
          'therapySessions.notifications.cancelErrorSummary',
          'therapySessions.notifications.cancelErrorDetail',
        );
      } finally {
        this.cancelingSessionSignal.set(false);
      }
    });
  }

  private notifySuccess(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant(summaryKey),
      detail: this.translateService.instant(detailKey),
    });
  }

  private notifyError(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant(summaryKey),
      detail: this.translateService.instant(detailKey),
    });
  }
}
