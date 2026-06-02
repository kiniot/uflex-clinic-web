import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../application/organization.store';
import { PlanningStore } from '../../../../planning/application/planning.store';
import { AssignPatientCommand } from '../../../domain/model/assign-patient.command';
import { PatientAssignmentDialog } from '../../components/patient-assignment-dialog/patient-assignment-dialog';

type RoleContext = 'admin' | 'physiotherapist';

@Component({
  selector: 'app-patient-detail',
  imports: [DatePipe, RouterLink, TranslatePipe, ButtonModule, PatientAssignmentDialog],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
})
export class PatientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly roleContext =
    (this.route.snapshot.data['roleContext'] as RoleContext | undefined) ?? 'physiotherapist';

  private readonly patientId = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly patient = this.organizationStore.selectedPatient;
  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly physiotherapist = this.organizationStore.currentPhysiotherapist;
  protected readonly physiotherapists = this.organizationStore.physiotherapists;
  protected readonly treatmentPlans = this.planningStore.patientTreatmentPlans;
  protected readonly isLoadingPatient = this.organizationStore.isLoadingSelectedPatient;
  protected readonly isLoadingTreatmentPlans = this.planningStore.isLoadingTreatmentPlans;
  protected readonly isDischargingPatient = this.organizationStore.isDischargingPatient;
  protected readonly isAssigningPatient = this.organizationStore.isAssigningPatient;
  protected readonly loadingRows = [0, 1, 2];
  protected readonly isAdminContext = this.roleContext === 'admin';
  protected readonly breadcrumbBaseRoute = this.isAdminContext
    ? '/clinic-admin/organization'
    : '/physiotherapist/patients';
  protected readonly breadcrumbBaseLabelKey = this.isAdminContext
    ? 'organization.tabs.patients'
    : 'patientDetail.breadcrumb.patients';
  protected readonly isAssignmentDialogVisible = signal(false);
  protected readonly selectedAssignmentPhysiotherapistId = signal<string | null>(null);

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
}
