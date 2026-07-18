import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OrganizationStore } from '../../../application/organization.store';
import { PlanningStore } from '../../../../planning/application/planning.store';
import { TreatmentPlan } from '../../../../planning/domain/model/treatment-plan.entity';
import { ConfirmActionDialog } from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import { AssignPatientCommand } from '../../../domain/model/assign-patient.command';
import { UpdatePatientByClinicAdminCommand } from '../../../domain/model/update-patient-by-clinic-admin.command';
import { UpdatePatientContactCommand } from '../../../domain/model/update-patient-contact.command';
import { PatientAdminEditDialog } from '../../components/patient-admin-edit-dialog/patient-admin-edit-dialog';
import { PatientContactEditDialog } from '../../components/patient-contact-edit-dialog/patient-contact-edit-dialog';
import { PatientAssignmentDialog } from '../../components/patient-assignment-dialog/patient-assignment-dialog';

type RoleContext = 'admin' | 'physiotherapist';
type PendingPlanAction = 'activate' | 'complete' | 'cancel' | 'delete';

@Component({
  selector: 'app-patient-detail',
  imports: [
    DatePipe,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    TooltipModule,
    PatientAssignmentDialog,
    PatientAdminEditDialog,
    PatientContactEditDialog,
    ConfirmActionDialog,
  ],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
})
export class PatientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly roleContext =
    (this.route.snapshot.data['roleContext'] as RoleContext | undefined) ?? 'physiotherapist';

  private readonly patientId = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly patientRouteId = computed(() => this.patientId().get('patientId') ?? '');

  protected readonly patient = this.organizationStore.selectedPatient;
  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly physiotherapist = this.organizationStore.currentPhysiotherapist;
  protected readonly physiotherapists = this.organizationStore.physiotherapists;
  protected readonly treatmentPlans = this.planningStore.patientTreatmentPlans;
  protected readonly isLoadingPatient = this.organizationStore.isLoadingSelectedPatient;
  protected readonly isLoadingTreatmentPlans = this.planningStore.isLoadingTreatmentPlans;
  protected readonly isDischargingPatient = this.organizationStore.isDischargingPatient;
  protected readonly isAssigningPatient = this.organizationStore.isAssigningPatient;
  protected readonly isUpdatingPatient = this.organizationStore.isUpdatingPatient;
  protected readonly isDeletingPatient = this.organizationStore.isDeletingPatient;
  protected readonly loadingRows = [0, 1, 2];
  protected readonly isAdminContext = this.roleContext === 'admin';
  protected readonly breadcrumbBaseRoute = this.isAdminContext
    ? '/clinic-admin/organization'
    : '/physiotherapist/patients';
  protected readonly breadcrumbBaseQueryParams = this.isAdminContext
    ? { tab: 'patients' }
    : undefined;
  protected readonly breadcrumbBaseLabelKey = this.isAdminContext
    ? 'organization.tabs.patients'
    : 'patientDetail.breadcrumb.patients';
  protected readonly isAssignmentDialogVisible = signal(false);
  protected readonly selectedAssignmentPhysiotherapistId = signal<string | null>(null);
  protected readonly isPatientEditDialogVisible = signal(false);
  protected readonly isDeletePatientDialogVisible = signal(false);
  protected readonly pendingPlanAction = signal<PendingPlanAction | null>(null);
  protected readonly targetTreatmentPlan = signal<TreatmentPlan | null>(null);
  protected readonly isRunningPlanAction = signal(false);

  protected readonly assignedPhysiotherapistLabel = computed(() => {
    const patient = this.patient();
    const physiotherapist = this.physiotherapist();
    const clinicPhysiotherapist = this.physiotherapists().find(
      (currentPhysiotherapist) => currentPhysiotherapist.id === patient?.assignedPhysiotherapistId,
    );

    if (!patient?.assignedPhysiotherapistId) {
      return this.translate.instant('organization.patients.unassigned');
    }
    if (physiotherapist && physiotherapist.id === patient.assignedPhysiotherapistId) {
      return physiotherapist.fullName;
    }
    if (clinicPhysiotherapist) {
      return clinicPhysiotherapist.fullName;
    }

    return patient.assignedPhysiotherapistId;
  });

  protected readonly clinicLabel = computed(() => {
    const clinic = this.clinic();
    const patient = this.patient();
    return clinic?.commercialName ?? clinic?.legalName ?? patient?.clinicId ?? '—';
  });

  protected readonly assignmentActionLabel = computed(() => {
    const patient = this.patient();
    if (!patient?.assignedPhysiotherapistId) {
      return this.translate.instant('organization.patients.actions.assign');
    }

    return this.translate.instant('organization.patients.actions.reassign');
  });
  protected readonly confirmDialogVisible = computed(
    () => this.pendingPlanAction() !== null && this.targetTreatmentPlan() !== null,
  );
  protected readonly confirmDialogTitleKey = computed(() => {
    switch (this.pendingPlanAction()) {
      case 'activate':
        return 'treatmentPlanWorkspace.confirm.activateTitle';
      case 'complete':
        return 'treatmentPlanWorkspace.confirm.completeTitle';
      case 'cancel':
        return 'treatmentPlanWorkspace.confirm.cancelTitle';
      case 'delete':
        return 'treatmentPlanWorkspace.confirm.deleteTitle';
      default:
        return 'shared.confirmAction.title';
    }
  });
  protected readonly confirmDialogMessageKey = computed(() => {
    switch (this.pendingPlanAction()) {
      case 'activate':
        return 'treatmentPlanWorkspace.confirm.activateBody';
      case 'complete':
        return 'treatmentPlanWorkspace.confirm.completeBody';
      case 'cancel':
        return 'treatmentPlanWorkspace.confirm.cancelBody';
      case 'delete':
        return 'treatmentPlanWorkspace.confirm.deleteBody';
      default:
        return 'shared.confirmAction.body';
    }
  });
  protected readonly confirmDialogActionLabelKey = computed(() => {
    switch (this.pendingPlanAction()) {
      case 'activate':
        return 'treatmentPlanWorkspace.actions.activate';
      case 'complete':
        return 'treatmentPlanWorkspace.actions.complete';
      case 'cancel':
        return 'treatmentPlanWorkspace.actions.cancel';
      case 'delete':
        return 'treatmentPlanWorkspace.actions.delete';
      default:
        return 'shared.confirmAction.confirm';
    }
  });
  protected readonly confirmDialogTone = computed(() =>
    this.pendingPlanAction() === 'cancel' || this.pendingPlanAction() === 'delete'
      ? 'danger'
      : 'primary',
  );
  protected readonly confirmDialogIconClass = computed(() => {
    switch (this.pendingPlanAction()) {
      case 'activate':
        return 'pi pi-play-circle';
      case 'complete':
        return 'pi pi-check-circle';
      case 'cancel':
        return 'pi pi-ban';
      case 'delete':
        return 'pi pi-trash';
      default:
        return 'pi pi-question-circle';
    }
  });
  protected readonly confirmDialogParams = computed(() => ({
    plan: this.targetTreatmentPlan()?.name ?? '',
    patient: this.patient()?.fullName ?? '',
  }));

  constructor() {
    effect(() => {
      const patientId = this.patientId().get('patientId');
      if (!patientId) return;

      void this.organizationStore.loadCurrentClinicOnce();
      if (this.isAdminContext) {
        void this.organizationStore.loadClinicPhysiotherapists();
      } else {
        void this.organizationStore.loadCurrentPhysiotherapistOnce();
        void this.planningStore.loadTreatmentPlansByPatient(patientId);
      }
      void this.organizationStore.loadPatientById(patientId);
    });
  }

  protected onDischargePatient() {
    const patientId = this.patient()?.id;
    if (!patientId || this.patient()?.status === 'DISCHARGED') return;
    void this.dischargePatient(patientId);
  }

  protected openAssignmentDialog() {
    const patient = this.patient();
    if (!this.isAdminContext || !patient) return;

    this.selectedAssignmentPhysiotherapistId.set(patient.assignedPhysiotherapistId);
    this.isAssignmentDialogVisible.set(true);
  }

  protected closeAssignmentDialog() {
    this.isAssignmentDialogVisible.set(false);
    this.selectedAssignmentPhysiotherapistId.set(null);
  }

  protected openPatientEditDialog() {
    if (!this.patient()) return;
    this.isPatientEditDialogVisible.set(true);
  }

  protected closePatientEditDialog() {
    this.isPatientEditDialogVisible.set(false);
  }

  protected openDeletePatientDialog() {
    if (!this.patient()) return;
    this.isDeletePatientDialogVisible.set(true);
  }

  protected closeDeletePatientDialog() {
    if (this.isDeletingPatient()) return;
    this.isDeletePatientDialogVisible.set(false);
  }

  protected canShowActivateAction(plan: TreatmentPlan): boolean {
    return plan.status === 'SCHEDULED';
  }

  protected canShowCompleteAction(plan: TreatmentPlan): boolean {
    return plan.status === 'ACTIVE';
  }

  protected canShowCancelAction(plan: TreatmentPlan): boolean {
    return plan.status === 'SCHEDULED' || plan.status === 'ACTIVE';
  }

  protected canShowDeleteAction(plan: TreatmentPlan): boolean {
    return plan.status === 'COMPLETED' || plan.status === 'CANCELED';
  }

  protected canShowEditAction(plan: TreatmentPlan): boolean {
    return plan.status !== 'COMPLETED' && plan.status !== 'CANCELED';
  }

  protected onRequestPlanAction(action: PendingPlanAction, plan: TreatmentPlan): void {
    this.pendingPlanAction.set(action);
    this.targetTreatmentPlan.set(plan);
  }

  protected closePlanActionDialog(): void {
    if (this.isRunningPlanAction()) return;
    this.clearPlanActionDialog();
  }

  protected async confirmPlanAction(): Promise<void> {
    const action = this.pendingPlanAction();
    const plan = this.targetTreatmentPlan();
    const patientId = this.patient()?.id;
    if (!action || !plan || !patientId) return;

    this.isRunningPlanAction.set(true);
    try {
      if (action === 'activate') {
        await this.planningStore.activateTreatmentPlan(plan.id);
        this.notifyPlanActionSuccess(
          'treatmentPlanWorkspace.notifications.activateSuccessSummary',
          'treatmentPlanWorkspace.notifications.activateSuccessDetail',
        );
      } else if (action === 'complete') {
        await this.planningStore.completeTreatmentPlan(plan.id);
        this.notifyPlanActionSuccess(
          'treatmentPlanWorkspace.notifications.completeSuccessSummary',
          'treatmentPlanWorkspace.notifications.completeSuccessDetail',
        );
      } else if (action === 'cancel') {
        await this.planningStore.cancelTreatmentPlan(plan.id);
        this.notifyPlanActionSuccess(
          'treatmentPlanWorkspace.notifications.cancelSuccessSummary',
          'treatmentPlanWorkspace.notifications.cancelSuccessDetail',
        );
      } else {
        await this.planningStore.deleteTreatmentPlan(plan.id);
        this.notifyPlanActionSuccess(
          'treatmentPlanWorkspace.notifications.deleteSuccessSummary',
          'treatmentPlanWorkspace.notifications.deleteSuccessDetail',
        );
      }

      this.clearPlanActionDialog();
      await this.planningStore.loadTreatmentPlansByPatient(patientId);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('treatmentPlanWorkspace.notifications.actionErrorSummary'),
        detail: this.translate.instant('treatmentPlanWorkspace.notifications.actionErrorDetail'),
        life: 4500,
      });
    } finally {
      this.isRunningPlanAction.set(false);
    }
  }

  protected async saveAssignment(): Promise<void> {
    const patient = this.patient();
    if (!this.isAdminContext || !patient) return;

    try {
      await this.organizationStore.assignPatient(
        patient.id,
        new AssignPatientCommand({
          physiotherapistId: this.selectedAssignmentPhysiotherapistId(),
        }),
      );
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.assignment.successSummary'),
        detail: this.translate.instant('organization.assignment.successDetail'),
        life: 4000,
      });
      this.closeAssignmentDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.assignment.errorSummary'),
        detail: this.translate.instant('organization.assignment.errorDetail'),
        life: 4500,
      });
    }
  }

  protected async savePatientEdit(command: UpdatePatientContactCommand): Promise<void> {
    const patient = this.patient();
    if (!patient) return;

    try {
      await this.organizationStore.updatePatientAsPhysiotherapist(patient.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientDetail.notifications.editSuccessSummary'),
        detail: this.translate.instant('patientDetail.notifications.editSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
      this.closePatientEditDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientDetail.notifications.editErrorSummary'),
        detail: this.translate.instant('patientDetail.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  protected async confirmDeletePatient(): Promise<void> {
    const patient = this.patient();
    if (!patient) return;

    try {
      await this.organizationStore.deletePatient(patient.id);
      this.isDeletePatientDialogVisible.set(false);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientDetail.notifications.deleteSuccessSummary'),
        detail: this.translate.instant('patientDetail.notifications.deleteSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
      await this.router.navigate(
        this.isAdminContext ? ['/clinic-admin/organization'] : ['/physiotherapist/patients'],
        this.isAdminContext ? { queryParams: { tab: 'patients' } } : undefined,
      );
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientDetail.notifications.deleteErrorSummary'),
        detail: this.translate.instant('patientDetail.notifications.deleteErrorDetail'),
        life: 4500,
      });
    }
  }

  private async dischargePatient(patientId: string): Promise<void> {
    try {
      await this.organizationStore.dischargePatient(patientId);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientDetail.notifications.dischargeSuccessSummary'),
        detail: this.translate.instant('patientDetail.notifications.dischargeSuccessDetail', {
          name: this.patient()?.fullName ?? '',
        }),
        life: 4000,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientDetail.notifications.dischargeErrorSummary'),
        detail: this.translate.instant('patientDetail.notifications.dischargeErrorDetail'),
        life: 4500,
      });
    }
  }

  private notifyPlanActionSuccess(summaryKey: string, detailKey: string): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
      life: 4000,
    });
  }

  protected async saveAdminPatientEdit(command: UpdatePatientByClinicAdminCommand): Promise<void> {
    const patient = this.patient();
    if (!patient) return;

    try {
      await this.organizationStore.updatePatientAsClinicAdmin(patient.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.patients.notifications.editSuccessSummary'),
        detail: this.translate.instant('organization.patients.notifications.editSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
      this.closePatientEditDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.patients.notifications.editErrorSummary'),
        detail: this.translate.instant('organization.patients.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  private clearPlanActionDialog(): void {
    this.pendingPlanAction.set(null);
    this.targetTreatmentPlan.set(null);
  }
}
