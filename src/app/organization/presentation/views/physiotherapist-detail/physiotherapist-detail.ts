import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OrganizationStore } from '../../../application/organization.store';
import { AssignPatientCommand } from '../../../domain/model/assign-patient.command';
import { Patient } from '../../../domain/model/patient.entity';
import { UpdatePatientByClinicAdminCommand } from '../../../domain/model/update-patient-by-clinic-admin.command';
import { PatientAdminEditDialog } from '../../components/patient-admin-edit-dialog/patient-admin-edit-dialog';
import { PatientAssignmentDialog } from '../../components/patient-assignment-dialog/patient-assignment-dialog';
import { PhysiotherapistEditDialog } from '../../components/physiotherapist-edit-dialog/physiotherapist-edit-dialog';
import { ConfirmActionDialog } from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import { UpdatePhysiotherapistCommand } from '../../../domain/model/update-physiotherapist.command';

@Component({
  selector: 'app-physiotherapist-detail',
  imports: [
    DatePipe,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    TooltipModule,
    PatientAdminEditDialog,
    PatientAssignmentDialog,
    PhysiotherapistEditDialog,
    ConfirmActionDialog,
  ],
  templateUrl: './physiotherapist-detail.html',
  styleUrl: './physiotherapist-detail.scss',
})
export class PhysiotherapistDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private readonly physiotherapistId = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly physiotherapist = this.organizationStore.selectedPhysiotherapist;
  protected readonly physiotherapists = this.organizationStore.physiotherapists;
  protected readonly assignedPatients = this.organizationStore.patientsByPhysiotherapist;
  protected readonly isLoadingPhysiotherapist =
    this.organizationStore.isLoadingSelectedPhysiotherapist;
  protected readonly isLoadingPatients = this.organizationStore.isLoadingPatientsByPhysiotherapist;
  protected readonly isAssigningPatient = this.organizationStore.isAssigningPatient;
  protected readonly isUpdatingPatient = this.organizationStore.isUpdatingPatient;
  protected readonly isDeletingPatient = this.organizationStore.isDeletingPatient;
  protected readonly isUpdatingPhysiotherapist = this.organizationStore.isUpdatingPhysiotherapist;
  protected readonly isSuspendingPhysiotherapist = this.organizationStore.isSuspendingPhysiotherapist;
  protected readonly isReactivatingPhysiotherapist =
    this.organizationStore.isReactivatingPhysiotherapist;
  protected readonly isDeletingPhysiotherapist = this.organizationStore.isDeletingPhysiotherapist;
  protected readonly loadingRows = [0, 1, 2];
  protected readonly isEditDialogVisible = signal(false);
  protected readonly pendingAction = signal<'suspend' | 'reactivate' | 'delete' | null>(null);
  protected readonly selectedPatientForAssignment = signal<Patient | null>(null);
  protected readonly selectedAssignmentPhysiotherapistId = signal<string | null>(null);
  protected readonly selectedPatientForEdit = signal<Patient | null>(null);
  protected readonly isPatientEditDialogVisible = signal(false);
  protected readonly selectedPatientForDelete = signal<Patient | null>(null);
  protected readonly isDeletePatientDialogVisible = signal(false);

  protected readonly activePatientsCount = computed(
    () => this.assignedPatients().filter((patient) => patient.status !== 'DISCHARGED').length,
  );
  protected readonly confirmDialogVisible = computed(
    () => this.physiotherapist() !== null && this.pendingAction() !== null,
  );
  protected readonly confirmDialogTitleKey = computed(() => {
    switch (this.pendingAction()) {
      case 'suspend':
        return 'organization.physiotherapists.confirm.suspendTitle';
      case 'reactivate':
        return 'organization.physiotherapists.confirm.reactivateTitle';
      case 'delete':
        return 'organization.physiotherapists.confirm.deleteTitle';
      default:
        return 'shared.confirmAction.title';
    }
  });
  protected readonly confirmDialogMessageKey = computed(() => {
    switch (this.pendingAction()) {
      case 'suspend':
        return 'organization.physiotherapists.confirm.suspendBody';
      case 'reactivate':
        return 'organization.physiotherapists.confirm.reactivateBody';
      case 'delete':
        return 'organization.physiotherapists.confirm.deleteBody';
      default:
        return 'shared.confirmAction.body';
    }
  });
  protected readonly confirmDialogActionLabelKey = computed(() => {
    switch (this.pendingAction()) {
      case 'suspend':
        return 'organization.physiotherapists.actions.suspend';
      case 'reactivate':
        return 'organization.physiotherapists.actions.reactivate';
      case 'delete':
        return 'organization.physiotherapists.actions.delete';
      default:
        return 'shared.confirmAction.confirm';
    }
  });
  protected readonly confirmDialogTone = computed(() =>
    this.pendingAction() === 'delete' ? 'danger' : 'primary',
  );
  protected readonly confirmDialogPending = computed(() => {
    switch (this.pendingAction()) {
      case 'suspend':
        return this.isSuspendingPhysiotherapist();
      case 'reactivate':
        return this.isReactivatingPhysiotherapist();
      case 'delete':
        return this.isDeletingPhysiotherapist();
      default:
        return false;
    }
  });
  protected readonly confirmDialogIconClass = computed(() => {
    switch (this.pendingAction()) {
      case 'suspend':
        return 'pi pi-pause-circle';
      case 'reactivate':
        return 'pi pi-play-circle';
      case 'delete':
        return 'pi pi-trash';
      default:
        return 'pi pi-question-circle';
    }
  });
  protected readonly confirmDialogParams = computed(() => ({
    name: this.physiotherapist()?.fullName ?? '',
  }));

  constructor() {
    effect(() => {
      const physiotherapistId = this.physiotherapistId().get('physiotherapistId');
      if (!physiotherapistId) return;

      void this.organizationStore.loadCurrentClinicOnce();
      void this.organizationStore.loadClinicPhysiotherapists();
      void this.organizationStore.loadClinicPhysiotherapistById(physiotherapistId);
      void this.organizationStore.loadPatientsByPhysiotherapistId(physiotherapistId);
    });
  }

  protected initialsFor(fullName: string): string {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('');
  }

  protected assignmentActionLabel(patient: Patient): string {
    return patient.assignedPhysiotherapistId
      ? this.translate.instant('organization.patients.actions.reassign')
      : this.translate.instant('organization.patients.actions.assign');
  }

  protected openPatient(patient: Patient) {
    void this.router.navigate(['/clinic-admin/organization/patients', patient.id]);
  }

  protected onAssignPatient(patient: Patient) {
    this.selectedPatientForAssignment.set(patient);
    this.selectedAssignmentPhysiotherapistId.set(patient.assignedPhysiotherapistId);
  }

  protected closeAssignmentDialog() {
    this.selectedPatientForAssignment.set(null);
    this.selectedAssignmentPhysiotherapistId.set(null);
  }

  protected async saveAssignment() {
    const patient = this.selectedPatientForAssignment();
    if (!patient) return;

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

  protected onEditPatient(patient: Patient) {
    this.selectedPatientForEdit.set(patient);
    this.isPatientEditDialogVisible.set(true);
  }

  protected closeEditPatientDialog() {
    this.isPatientEditDialogVisible.set(false);
    this.selectedPatientForEdit.set(null);
  }

  protected async savePatientEdit(command: UpdatePatientByClinicAdminCommand) {
    const patient = this.selectedPatientForEdit();
    if (!patient) return;

    try {
      const updated = await this.organizationStore.updatePatientAsClinicAdmin(patient.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.patients.notifications.editSuccessSummary'),
        detail: this.translate.instant('organization.patients.notifications.editSuccessDetail', {
          name: updated.fullName,
        }),
        life: 4000,
      });
      this.closeEditPatientDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.patients.notifications.editErrorSummary'),
        detail: this.translate.instant('organization.patients.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  protected onRequestDeletePatient(patient: Patient) {
    this.selectedPatientForDelete.set(patient);
    this.isDeletePatientDialogVisible.set(true);
  }

  protected closeDeletePatientDialog() {
    if (this.isDeletingPatient()) return;
    this.isDeletePatientDialogVisible.set(false);
    this.selectedPatientForDelete.set(null);
  }

  protected async confirmDeletePatient() {
    const patient = this.selectedPatientForDelete();
    if (!patient) return;

    try {
      await this.organizationStore.deletePatient(patient.id);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.patients.notifications.deleteSuccessSummary'),
        detail: this.translate.instant('organization.patients.notifications.deleteSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
      this.closeDeletePatientDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.patients.notifications.deleteErrorSummary'),
        detail: this.translate.instant('organization.patients.notifications.deleteErrorDetail'),
        life: 4500,
      });
    }
  }

  protected openEditDialog() {
    if (!this.physiotherapist()) return;
    this.isEditDialogVisible.set(true);
  }

  protected closeEditDialog() {
    this.isEditDialogVisible.set(false);
  }

  protected requestToggleStatus() {
    const physiotherapist = this.physiotherapist();
    if (!physiotherapist) return;
    this.pendingAction.set(physiotherapist.status === 'SUSPENDED' ? 'reactivate' : 'suspend');
  }

  protected requestDelete() {
    if (!this.physiotherapist()) return;
    this.pendingAction.set('delete');
  }

  protected closeActionDialog() {
    if (this.confirmDialogPending()) return;
    this.pendingAction.set(null);
  }

  protected async savePhysiotherapistEdit(command: UpdatePhysiotherapistCommand) {
    const physiotherapist = this.physiotherapist();
    if (!physiotherapist) return;

    try {
      const updated = await this.organizationStore.updatePhysiotherapist(physiotherapist.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.physiotherapists.notifications.editSuccessSummary'),
        detail: this.translate.instant('organization.physiotherapists.notifications.editSuccessDetail', {
          name: updated.fullName,
        }),
        life: 4000,
      });
      this.closeEditDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.physiotherapists.notifications.editErrorSummary'),
        detail: this.translate.instant('organization.physiotherapists.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  protected async confirmAction() {
    const physiotherapist = this.physiotherapist();
    const action = this.pendingAction();
    if (!physiotherapist || !action) return;

    try {
      if (action === 'suspend') {
        await this.organizationStore.suspendPhysiotherapist(physiotherapist.id);
      } else if (action === 'reactivate') {
        await this.organizationStore.reactivatePhysiotherapist(physiotherapist.id);
      } else {
        await this.organizationStore.deletePhysiotherapist(physiotherapist.id);
      }

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant(
          `organization.physiotherapists.notifications.${action}SuccessSummary`,
        ),
        detail: this.translate.instant(
          `organization.physiotherapists.notifications.${action}SuccessDetail`,
          { name: physiotherapist.fullName },
        ),
        life: 4000,
      });

      if (action === 'delete') {
        await this.router.navigate(['/clinic-admin/organization'], {
          queryParams: { tab: 'physiotherapists' },
        });
        return;
      }

      this.closeActionDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant(
          `organization.physiotherapists.notifications.${action}ErrorSummary`,
        ),
        detail: this.translate.instant(
          `organization.physiotherapists.notifications.${action}ErrorDetail`,
          { name: physiotherapist.fullName },
        ),
        life: 4500,
      });
    }
  }
}
