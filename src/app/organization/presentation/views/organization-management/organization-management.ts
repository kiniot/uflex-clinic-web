import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AssignPatientCommand } from '../../../domain/model/assign-patient.command';
import { OrganizationStore } from '../../../application/organization.store';
import { Patient } from '../../../domain/model/patient.entity';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';
import { StatCard } from '../../../../shared/presentation/components/stat-card/stat-card';
import { PatientsTable } from '../../components/patients-table/patients-table';
import { PhysiotherapistsTable } from '../../components/physiotherapists-table/physiotherapists-table';

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
    DialogModule,
    InputTextModule,
    SelectModule,
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

  protected readonly totalPhysiotherapists = computed(() => this.physiotherapists().length);
  protected readonly totalPatients = computed(() => this.patients().length);
  protected readonly assignedPatientsCount = computed(
    () => this.patients().filter((patient) => !!patient.assignedPhysiotherapistId).length,
  );
  protected readonly unassignedPatientsCount = computed(
    () => this.patients().filter((patient) => !patient.assignedPhysiotherapistId).length,
  );
  protected readonly registeredPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'REGISTERED').length,
  );
  protected readonly inTreatmentPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'IN_TREATMENT').length,
  );
  protected readonly dischargedPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'DISCHARGED').length,
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
      label: this.translate.instant('organization.patients.status.REGISTERED'),
      value: 'REGISTERED',
    },
    {
      label: this.translate.instant('organization.patients.status.IN_TREATMENT'),
      value: 'IN_TREATMENT',
    },
    {
      label: this.translate.instant('organization.patients.status.DISCHARGED'),
      value: 'DISCHARGED',
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

  protected readonly assignmentOptions = computed<SelectOption<string | null>[]>(() => [
    {
      label: this.translate.instant('organization.assignment.keepUnassigned'),
      value: null,
    },
    ...this.physiotherapists().map((physiotherapist) => ({
      label: physiotherapist.fullName,
      value: physiotherapist.id,
    })),
  ]);

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
      const matchesStatus = status === 'all' || patient.status === status;
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

  constructor() {
    effect(() => {
      void this.store.loadCurrentClinicOnce();
      void this.store.loadCurrentClinicAdminOnce();
      void this.store.loadClinicPhysiotherapists();
      void this.store.loadClinicPatients();
    });
  }

  protected setActiveTab(tab: OrgTab) {
    this.activeTab.set(tab);
  }

  protected onOpenPhysiotherapist(physiotherapist: PhysiotherapistProfile) {
    void this.router.navigate(['/clinic-admin/organization/staff', physiotherapist.id]);
  }

  protected onOpenPatient(patient: Patient) {
    void this.router.navigate(['/clinic-admin/organization/patients', patient.id]);
  }

  protected onRegisterPhysiotherapist() {
    void this.router.navigate(['/clinic-admin/organization/staff/new']);
  }

  protected onRegisterPatient() {
    void this.router.navigate(['/clinic-admin/organization/patients/new']);
  }

  protected onAssignPatient(patient: Patient) {
    this.selectedPatientForAssignment.set(patient);
    this.selectedAssignmentPhysiotherapistId.set(patient.assignedPhysiotherapistId);
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
