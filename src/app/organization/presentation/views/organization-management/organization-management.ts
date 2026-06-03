import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AssignPatientCommand } from '../../../domain/model/assign-patient.command';
import { OrganizationStore } from '../../../application/organization.store';
import { Patient } from '../../../domain/model/patient.entity';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';
import { UpdatePatientByClinicAdminCommand } from '../../../domain/model/update-patient-by-clinic-admin.command';
import { PatientAssignmentDialog } from '../../components/patient-assignment-dialog/patient-assignment-dialog';
import { PatientAdminEditDialog } from '../../components/patient-admin-edit-dialog/patient-admin-edit-dialog';
import { PhysiotherapistEditDialog } from '../../components/physiotherapist-edit-dialog/physiotherapist-edit-dialog';
import { StatCard } from '../../../../shared/presentation/components/stat-card/stat-card';
import { PatientsTable } from '../../components/patients-table/patients-table';
import { PhysiotherapistsTable } from '../../components/physiotherapists-table/physiotherapists-table';
import { ConfirmActionDialog } from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import { UpdatePhysiotherapistCommand } from '../../../domain/model/update-physiotherapist.command';

type OrgTab = 'physiotherapists' | 'patients';
type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-organization-management',
  imports: [
    FormsModule,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    PatientAssignmentDialog,
    PatientAdminEditDialog,
    PhysiotherapistEditDialog,
    ConfirmActionDialog,
    StatCard,
    PhysiotherapistsTable,
    PatientsTable,
  ],
  templateUrl: './organization-management.html',
  styleUrl: './organization-management.scss',
})
export class OrganizationManagement {
  private readonly store = inject(OrganizationStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  protected readonly clinic = this.store.currentClinic;
  protected readonly clinicAdmin = this.store.currentClinicAdmin;
  protected readonly physiotherapists = this.store.physiotherapists;
  protected readonly patients = this.store.patients;
  protected readonly isLoadingCurrentClinic = this.store.isLoadingCurrentClinic;
  protected readonly isLoadingCurrentClinicAdmin = this.store.isLoadingCurrentClinicAdmin;
  protected readonly isLoadingPhysiotherapists = this.store.isLoadingPhysiotherapists;
  protected readonly isLoadingPatients = this.store.isLoadingPatients;
  protected readonly isAssigningPatient = this.store.isAssigningPatient;
  protected readonly isUpdatingPatient = this.store.isUpdatingPatient;
  protected readonly isDeletingPatient = this.store.isDeletingPatient;
  protected readonly isUpdatingPhysiotherapist = this.store.isUpdatingPhysiotherapist;
  protected readonly isSuspendingPhysiotherapist = this.store.isSuspendingPhysiotherapist;
  protected readonly isReactivatingPhysiotherapist = this.store.isReactivatingPhysiotherapist;
  protected readonly isDeletingPhysiotherapist = this.store.isDeletingPhysiotherapist;
  protected readonly loadingRows = [0, 1, 2, 3];

  protected readonly activeTab = signal<OrgTab>('physiotherapists');

  protected readonly physiotherapistQuery = signal('');
  protected readonly physiotherapistStatus = signal('all');
  protected readonly physiotherapistSpecialty = signal('all');
  protected readonly patientQuery = signal('');
  protected readonly patientStatus = signal('all');
  protected readonly patientAssignment = signal<PatientAssignmentFilter>('all');

  protected readonly selectedPatientForAssignment = signal<Patient | null>(null);
  protected readonly selectedAssignmentPhysiotherapistId = signal<string | null>(null);
  protected readonly selectedPatientForEdit = signal<Patient | null>(null);
  protected readonly isPatientEditDialogVisible = signal(false);
  protected readonly selectedPatientForDelete = signal<Patient | null>(null);
  protected readonly isDeletePatientDialogVisible = signal(false);
  protected readonly selectedPhysiotherapistForEdit = signal<PhysiotherapistProfile | null>(null);
  protected readonly isPhysiotherapistEditDialogVisible = signal(false);
  protected readonly selectedPhysiotherapistForAction = signal<PhysiotherapistProfile | null>(null);
  protected readonly pendingPhysiotherapistAction = signal<'suspend' | 'reactivate' | 'delete' | null>(
    null,
  );

  protected readonly totalPhysiotherapists = computed(() => this.physiotherapists().length);
  protected readonly totalPatients = computed(() => this.patients().length);
  protected readonly assignedPatientsCount = computed(
    () => this.patients().filter((patient) => !!patient.assignedPhysiotherapistId).length,
  );
  protected readonly unassignedPatientsCount = computed(
    () =>
      this.patients().filter(
        (patient) =>
          !patient.assignedPhysiotherapistId ||
          patient.status === 'UNASSIGNED' ||
          patient.status === 'REGISTERED',
      ).length,
  );
  protected readonly unassignedStatusPatientsCount = computed(
    () =>
      this.patients().filter(
        (patient) => patient.status === 'UNASSIGNED' || patient.status === 'REGISTERED',
      ).length,
  );
  protected readonly inTreatmentPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'IN_TREATMENT').length,
  );
  protected readonly completedPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'COMPLETED').length,
  );
  protected readonly dischargedPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'DISCHARGED').length,
  );
  protected readonly inactivePatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'INACTIVE').length,
  );

  protected readonly physiotherapistNameMap = computed<Record<string, string>>(() =>
    this.physiotherapists().reduce<Record<string, string>>((acc, physiotherapist) => {
      acc[physiotherapist.id] = physiotherapist.fullName;
      return acc;
    }, {}),
  );

  protected readonly physiotherapistStatusOptions = computed<SelectOption<string>[]>(() => [
    {
      label: this.translate.instant('organization.filters.allStatuses'),
      value: 'all',
    },
    {
      label: this.translate.instant('organization.physiotherapists.status.ACTIVE'),
      value: 'ACTIVE',
    },
    {
      label: this.translate.instant('organization.physiotherapists.status.INACTIVE'),
      value: 'INACTIVE',
    },
    {
      label: this.translate.instant('organization.physiotherapists.status.SUSPENDED'),
      value: 'SUSPENDED',
    },
  ]);

  protected readonly physiotherapistSpecialtyOptions = computed<SelectOption<string>[]>(() => {
    const specialties = Array.from(
      new Set(this.physiotherapists().map((physiotherapist) => physiotherapist.specialty)),
    );

    return [
      {
        label: this.translate.instant('organization.filters.allSpecialties'),
        value: 'all',
      },
      ...specialties.map((specialty) => ({
        label: this.translate.instant(`organization.physiotherapists.specialties.${specialty}`),
        value: specialty,
      })),
    ];
  });

  protected readonly patientStatusOptions = computed<SelectOption<string>[]>(() => [
    {
      label: this.translate.instant('organization.filters.allStatuses'),
      value: 'all',
    },
    {
      label: this.translate.instant('organization.patients.status.UNASSIGNED'),
      value: 'UNASSIGNED',
    },
    {
      label: this.translate.instant('organization.patients.status.IN_TREATMENT'),
      value: 'IN_TREATMENT',
    },
    {
      label: this.translate.instant('organization.patients.status.COMPLETED'),
      value: 'COMPLETED',
    },
    {
      label: this.translate.instant('organization.patients.status.DISCHARGED'),
      value: 'DISCHARGED',
    },
    {
      label: this.translate.instant('organization.patients.status.INACTIVE'),
      value: 'INACTIVE',
    },
  ]);

  protected readonly patientAssignmentOptions = computed<SelectOption<PatientAssignmentFilter>[]>(
    () => [
      {
        label: this.translate.instant('organization.filters.allAssignments'),
        value: 'all',
      },
      {
        label: this.translate.instant('organization.filters.assignedOnly'),
        value: 'assigned',
      },
      {
        label: this.translate.instant('organization.filters.unassignedOnly'),
        value: 'unassigned',
      },
    ],
  );

  protected readonly visiblePhysiotherapists = computed(() => {
    const query = this.physiotherapistQuery().trim().toLowerCase();
    const status = this.physiotherapistStatus();
    const specialty = this.physiotherapistSpecialty();

    return this.physiotherapists().filter((physiotherapist) => {
      const matchesQuery =
        query.length === 0 ||
        physiotherapist.fullName.toLowerCase().includes(query) ||
        physiotherapist.email.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || physiotherapist.status === status;
      const matchesSpecialty = specialty === 'all' || physiotherapist.specialty === specialty;
      return matchesQuery && matchesStatus && matchesSpecialty;
    });
  });

  protected readonly visiblePatients = computed(() => {
    const query = this.patientQuery().trim().toLowerCase();
    const status = this.patientStatus();
    const assignment = this.patientAssignment();

    return this.patients().filter((patient) => {
      const matchesQuery =
        query.length === 0 ||
        patient.fullName.toLowerCase().includes(query) ||
        patient.dni.toLowerCase().includes(query);
      const matchesStatus =
        status === 'all' ||
        patient.status === status ||
        (status === 'UNASSIGNED' && patient.status === 'REGISTERED');
      const matchesAssignment =
        assignment === 'all' ||
        (assignment === 'assigned' && !!patient.assignedPhysiotherapistId) ||
        (assignment === 'unassigned' && !patient.assignedPhysiotherapistId);

      return matchesQuery && matchesStatus && matchesAssignment;
    });
  });

  protected readonly formattedAddress = computed(() => {
    const clinic = this.clinic();
    if (!clinic) return '—';

    return [
      clinic.address.addressLine1,
      clinic.address.addressLine2,
      clinic.address.city,
      clinic.address.region,
      clinic.address.postalCode,
    ]
      .filter(Boolean)
      .join(', ');
  });
  protected readonly confirmPhysiotherapistDialogVisible = computed(
    () =>
      this.selectedPhysiotherapistForAction() !== null &&
      this.pendingPhysiotherapistAction() !== null,
  );
  protected readonly confirmPhysiotherapistDialogTitleKey = computed(() => {
    switch (this.pendingPhysiotherapistAction()) {
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
  protected readonly confirmPhysiotherapistDialogMessageKey = computed(() => {
    switch (this.pendingPhysiotherapistAction()) {
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
  protected readonly confirmPhysiotherapistDialogConfirmKey = computed(() => {
    switch (this.pendingPhysiotherapistAction()) {
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
  protected readonly confirmPhysiotherapistDialogIconClass = computed(() => {
    switch (this.pendingPhysiotherapistAction()) {
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
  protected readonly confirmPhysiotherapistDialogTone = computed(() =>
    this.pendingPhysiotherapistAction() === 'delete' ? 'danger' : 'primary',
  );
  protected readonly confirmPhysiotherapistDialogPending = computed(() => {
    switch (this.pendingPhysiotherapistAction()) {
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
  protected readonly confirmPhysiotherapistDialogParams = computed(() => ({
    name: this.selectedPhysiotherapistForAction()?.fullName ?? '',
  }));

  constructor() {
    effect(() => {
      const requestedTab = this.route.snapshot.queryParamMap.get('tab');
      if (requestedTab === 'patients' || requestedTab === 'physiotherapists') {
        this.activeTab.set(requestedTab);
      }
    });

    effect(() => {
      void this.store.loadCurrentClinicOnce();
      void this.store.loadCurrentClinicAdminOnce();
      void this.store.loadClinicPhysiotherapists();
      void this.store.loadClinicPatients();
    });
  }

  protected setActiveTab(tab: OrgTab) {
    this.activeTab.set(tab);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected onOpenPhysiotherapist(physiotherapist: PhysiotherapistProfile) {
    void this.router.navigate(['/clinic-admin/organization/physiotherapists', physiotherapist.id]);
  }

  protected onOpenPatient(patient: Patient) {
    void this.router.navigate(['/clinic-admin/organization/patients', patient.id]);
  }

  protected onRegisterPhysiotherapist() {
    void this.router.navigate(['/clinic-admin/organization/physiotherapists/new']);
  }

  protected onRegisterPatient() {
    void this.router.navigate(['/clinic-admin/organization/patients/new']);
  }

  protected onEditPhysiotherapist(physiotherapist: PhysiotherapistProfile) {
    this.selectedPhysiotherapistForEdit.set(physiotherapist);
    this.isPhysiotherapistEditDialogVisible.set(true);
  }

  protected closePhysiotherapistEditDialog() {
    this.isPhysiotherapistEditDialogVisible.set(false);
    this.selectedPhysiotherapistForEdit.set(null);
  }

  protected async savePhysiotherapistEdit(command: UpdatePhysiotherapistCommand) {
    const physiotherapist = this.selectedPhysiotherapistForEdit();
    if (!physiotherapist) return;

    try {
      const updated = await this.store.updatePhysiotherapist(physiotherapist.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.physiotherapists.notifications.editSuccessSummary'),
        detail: this.translate.instant('organization.physiotherapists.notifications.editSuccessDetail', {
          name: updated.fullName,
        }),
        life: 4000,
      });
      this.closePhysiotherapistEditDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.physiotherapists.notifications.editErrorSummary'),
        detail: this.translate.instant('organization.physiotherapists.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  protected onTogglePhysiotherapistStatus(physiotherapist: PhysiotherapistProfile) {
    const action = physiotherapist.status === 'SUSPENDED' ? 'reactivate' : 'suspend';
    this.selectedPhysiotherapistForAction.set(physiotherapist);
    this.pendingPhysiotherapistAction.set(action);
  }

  protected onRequestDeletePhysiotherapist(physiotherapist: PhysiotherapistProfile) {
    this.selectedPhysiotherapistForAction.set(physiotherapist);
    this.pendingPhysiotherapistAction.set('delete');
  }

  protected closePhysiotherapistActionDialog() {
    if (this.confirmPhysiotherapistDialogPending()) return;
    this.selectedPhysiotherapistForAction.set(null);
    this.pendingPhysiotherapistAction.set(null);
  }

  protected async confirmPhysiotherapistAction() {
    const physiotherapist = this.selectedPhysiotherapistForAction();
    const action = this.pendingPhysiotherapistAction();
    if (!physiotherapist || !action) return;

    try {
      if (action === 'suspend') {
        await this.store.suspendPhysiotherapist(physiotherapist.id);
      } else if (action === 'reactivate') {
        await this.store.reactivatePhysiotherapist(physiotherapist.id);
      } else {
        await this.store.deletePhysiotherapist(physiotherapist.id);
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
      this.closePhysiotherapistActionDialog();
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

  protected onAssignPatient(patient: Patient) {
    this.selectedPatientForAssignment.set(patient);
    this.selectedAssignmentPhysiotherapistId.set(patient.assignedPhysiotherapistId);
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
      const updated = await this.store.updatePatientAsClinicAdmin(patient.id, command);
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
      await this.store.deletePatient(patient.id);
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

  protected closeAssignmentDialog() {
    this.selectedPatientForAssignment.set(null);
    this.selectedAssignmentPhysiotherapistId.set(null);
  }

  protected saveAssignment() {
    const patient = this.selectedPatientForAssignment();
    if (!patient) return;

    void this.persistAssignment(patient.id);
  }

  private async persistAssignment(patientId: string): Promise<void> {
    try {
      await this.store.assignPatient(
        patientId,
        new AssignPatientCommand({
          physiotherapistId: this.selectedAssignmentPhysiotherapistId(),
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.assignment.successSummary'),
        detail: this.translate.instant('organization.assignment.successDetail'),
        life: 3500,
      });

      this.closeAssignmentDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.assignment.errorSummary'),
        detail: this.translate.instant('organization.assignment.errorDetail'),
        life: 4000,
      });
    }
  }
}
