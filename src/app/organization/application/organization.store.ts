import { HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { isAppError } from '../../shared/domain/model/app-error';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { ClinicAdminProfile } from '../domain/model/clinic-admin-profile.entity';
import { ClinicAddressValue } from '../domain/model/clinic-address.value';
import { ClinicProfile } from '../domain/model/clinic-profile.entity';
import { Clinic } from '../domain/model/clinic.entity';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { Patient } from '../domain/model/patient.entity';
import { RegisterClinicAdminCommand } from '../domain/model/register-clinic-admin.command';
import { PhysiotherapistProfile } from '../domain/model/physiotherapist-profile.entity';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';
import { UpdatePatientByClinicAdminCommand } from '../domain/model/update-patient-by-clinic-admin.command';
import { UpdatePhysiotherapistCommand } from '../domain/model/update-physiotherapist.command';
import { UpdatePatientContactCommand } from '../domain/model/update-patient-contact.command';
import { TeamMember } from '../domain/model/team-member.entity';
import { OrganizationApi } from '../infrastructure/organization-api';
import { ClinicAdminProfileResource } from '../infrastructure/clinic-admin-profile-response';
import { ClinicProfileResource } from '../infrastructure/clinic-profile-response';
import { ClinicResource } from '../infrastructure/create-clinic-response';
import { PatientResource } from '../infrastructure/patient.response';
import { PhysiotherapistProfileResource } from '../infrastructure/physiotherapist-profile-response';

export type ClinicAdminProfileStatus = 'loading' | 'missing' | 'ready' | 'error';

/**
 * Application-layer store for the Organization bounded context.
 * Supports both clinic-admin and physiotherapist flows while keeping
 * temporary compatibility wrappers for the legacy mock-based UI.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationStore {
  private readonly latestCreatedClinicSignal = signal<ClinicResource | null>(null);
  private readonly currentClinicSignal = signal<ClinicProfile | null>(null);
  private readonly currentClinicAdminSignal = signal<ClinicAdminProfile | null>(null);
  private readonly currentClinicAdminProfileStatusSignal = signal<ClinicAdminProfileStatus>('loading');
  private readonly currentPhysiotherapistSignal = signal<PhysiotherapistProfile | null>(null);
  private readonly physiotherapistsSignal = signal<PhysiotherapistProfile[]>([]);
  private readonly patientsSignal = signal<Patient[]>([]);
  private readonly selectedPhysiotherapistSignal = signal<PhysiotherapistProfile | null>(null);
  private readonly selectedPatientSignal = signal<Patient | null>(null);
  private readonly patientsByPhysiotherapistSignal = signal<Patient[]>([]);
  private readonly viewedPhysiotherapistPatientsIdSignal = signal<string | null>(null);

  private readonly loadingCurrentClinicSignal = signal(false);
  private readonly loadingCurrentClinicAdminSignal = signal(false);
  private readonly loadingPhysiotherapistsSignal = signal(false);
  private readonly loadingPatientsSignal = signal(false);
  private readonly loadingSelectedPhysiotherapistSignal = signal(false);
  private readonly loadingSelectedPatientSignal = signal(false);
  private readonly loadingPatientsByPhysiotherapistSignal = signal(false);
  private readonly registeringPhysiotherapistSignal = signal(false);
  private readonly registeringClinicAdminSignal = signal(false);
  private readonly updatingPhysiotherapistSignal = signal(false);
  private readonly suspendingPhysiotherapistSignal = signal(false);
  private readonly reactivatingPhysiotherapistSignal = signal(false);
  private readonly deletingPhysiotherapistSignal = signal(false);
  private readonly registeringPatientSignal = signal(false);
  private readonly assigningPatientSignal = signal(false);
  private readonly dischargingPatientSignal = signal(false);
  private readonly updatingPatientSignal = signal(false);
  private readonly deletingPatientSignal = signal(false);

  private readonly currentClinicResolvedSignal = signal(false);
  private readonly currentClinicAdminResolvedSignal = signal(false);
  private readonly currentPhysiotherapistResolvedSignal = signal(false);

  readonly latestCreatedClinic = this.latestCreatedClinicSignal.asReadonly();
  readonly currentClinic = this.currentClinicSignal.asReadonly();
  readonly currentClinicAdmin = this.currentClinicAdminSignal.asReadonly();
  readonly currentClinicAdminProfileStatus = this.currentClinicAdminProfileStatusSignal.asReadonly();
  readonly currentPhysiotherapist = this.currentPhysiotherapistSignal.asReadonly();
  readonly physiotherapists = this.physiotherapistsSignal.asReadonly();
  readonly patients = this.patientsSignal.asReadonly();
  readonly selectedPhysiotherapist = this.selectedPhysiotherapistSignal.asReadonly();
  readonly selectedPatient = this.selectedPatientSignal.asReadonly();
  readonly patientsByPhysiotherapist = this.patientsByPhysiotherapistSignal.asReadonly();

  readonly isLoadingCurrentClinic = this.loadingCurrentClinicSignal.asReadonly();
  readonly isLoadingCurrentClinicAdmin = this.loadingCurrentClinicAdminSignal.asReadonly();
  readonly isRegisteringClinicAdmin = this.registeringClinicAdminSignal.asReadonly();
  readonly isLoadingPhysiotherapists = this.loadingPhysiotherapistsSignal.asReadonly();
  readonly isLoadingPatients = this.loadingPatientsSignal.asReadonly();
  readonly isLoadingSelectedPhysiotherapist =
    this.loadingSelectedPhysiotherapistSignal.asReadonly();
  readonly isLoadingSelectedPatient = this.loadingSelectedPatientSignal.asReadonly();
  readonly isLoadingPatientsByPhysiotherapist =
    this.loadingPatientsByPhysiotherapistSignal.asReadonly();
  readonly isRegisteringPhysiotherapist = this.registeringPhysiotherapistSignal.asReadonly();
  readonly isUpdatingPhysiotherapist = this.updatingPhysiotherapistSignal.asReadonly();
  readonly isSuspendingPhysiotherapist = this.suspendingPhysiotherapistSignal.asReadonly();
  readonly isReactivatingPhysiotherapist = this.reactivatingPhysiotherapistSignal.asReadonly();
  readonly isDeletingPhysiotherapist = this.deletingPhysiotherapistSignal.asReadonly();
  readonly isRegisteringPatient = this.registeringPatientSignal.asReadonly();
  readonly isAssigningPatient = this.assigningPatientSignal.asReadonly();
  readonly isDischargingPatient = this.dischargingPatientSignal.asReadonly();
  readonly isUpdatingPatient = this.updatingPatientSignal.asReadonly();
  readonly isDeletingPatient = this.deletingPatientSignal.asReadonly();

  readonly inTreatmentPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'IN_TREATMENT').length,
  );
  readonly dischargedPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'DISCHARGED').length,
  );
  readonly registeredPatientsCount = computed(
    () =>
      this.patients().filter(
        (patient) => patient.status === 'REGISTERED' || patient.status === 'UNASSIGNED',
      ).length,
  );

  /**
   * @deprecated Compatibility wrapper for the legacy clinic-admin organization view.
   */
  readonly clinic = computed(
    () =>
      new Clinic({
        id: 0,
        name:
          this.currentClinic()?.commercialName ??
          this.currentClinic()?.legalName ??
          'Clinic organization',
        addressLine: this.formatAddress(this.currentClinic()),
        phone: this.formatPhone(this.currentClinic()),
        totalPatients: this.patients().length,
        patientsTrendPct: 0,
        activePhysiotherapists: this.physiotherapists().filter(
          (physiotherapist) => physiotherapist.status === 'ACTIVE',
        ).length,
        physiotherapistsOnLeave: 0,
        availableIotKits: 0,
        totalIotKits: 0,
      }),
  );

  /**
   * @deprecated Compatibility wrapper for the legacy clinic-admin organization view.
   */
  readonly teamMembers = computed(() => {
    const patients = this.patients();
    return this.physiotherapists().map(
      (physiotherapist) =>
        new TeamMember({
          id: this.numericIdFromString(physiotherapist.id),
          name: physiotherapist.fullName,
          email: physiotherapist.email,
          role: this.toLegacySpecializedRole(physiotherapist.specialty),
          activePatients: patients.filter(
            (patient) =>
              patient.assignedPhysiotherapistId === physiotherapist.id &&
              patient.status !== 'DISCHARGED',
          ).length,
          status: physiotherapist.status === 'ACTIVE' ? 'active' : 'inactive',
          avatarInitials: this.initialsFromName(physiotherapist.fullName),
        }),
    );
  });

  constructor(private readonly organizationApi: OrganizationApi) {}

  createClinic(command: CreateClinicCommand): Promise<ClinicResource> {
    return new Promise((resolve, reject) => {
      this.organizationApi.createClinic(command).subscribe({
        next: (clinicResource) => {
          this.latestCreatedClinicSignal.set(clinicResource);
          resolve(clinicResource);
        },
        error: (err) => reject(err),
      });
    });
  }

  async loadCurrentClinicOnce({
    force = false,
  }: { force?: boolean } = {}): Promise<ClinicProfile | null> {
    if (this.currentClinicResolvedSignal() && !force) {
      return this.currentClinicSignal();
    }

    this.loadingCurrentClinicSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.getCurrentClinic());
      const clinic = this.mapClinicProfile(resource);
      this.currentClinicSignal.set(clinic);
      this.currentClinicResolvedSignal.set(true);
      return clinic;
    } finally {
      this.loadingCurrentClinicSignal.set(false);
    }
  }

  async loadCurrentClinicAdminOnce({
    force = false,
  }: {
    force?: boolean;
  } = {}): Promise<ClinicAdminProfile | null> {
    if (this.currentClinicAdminResolvedSignal() && !force) {
      return this.currentClinicAdminSignal();
    }

    this.loadingCurrentClinicAdminSignal.set(true);
    this.currentClinicAdminProfileStatusSignal.set('loading');
    try {
      const resource = await firstValueFrom(this.organizationApi.getCurrentClinicAdmin());
      const clinicAdmin = this.mapClinicAdmin(resource);
      this.currentClinicAdminSignal.set(clinicAdmin);
      this.currentClinicAdminProfileStatusSignal.set('ready');
      this.currentClinicAdminResolvedSignal.set(true);
      return clinicAdmin;
    } catch (error) {
      if (this.isMissingClinicAdminProfileError(error)) {
        this.currentClinicAdminSignal.set(null);
        this.currentClinicAdminProfileStatusSignal.set('missing');
        this.currentClinicAdminResolvedSignal.set(true);
        return null;
      }

      this.currentClinicAdminProfileStatusSignal.set('error');
      throw error;
    } finally {
      this.loadingCurrentClinicAdminSignal.set(false);
    }
  }

  async registerClinicAdminProfile(
    command: RegisterClinicAdminCommand,
  ): Promise<ClinicAdminProfile> {
    this.registeringClinicAdminSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.registerClinicAdmin(command));
      const clinicAdmin = this.mapClinicAdmin(resource);
      this.currentClinicAdminSignal.set(clinicAdmin);
      this.currentClinicAdminProfileStatusSignal.set('ready');
      this.currentClinicAdminResolvedSignal.set(true);
      return clinicAdmin;
    } finally {
      this.registeringClinicAdminSignal.set(false);
    }
  }

  async loadCurrentPhysiotherapistOnce({
    force = false,
  }: {
    force?: boolean;
  } = {}): Promise<PhysiotherapistProfile | null> {
    if (this.currentPhysiotherapistResolvedSignal() && !force) {
      return this.currentPhysiotherapistSignal();
    }

    const resource = await firstValueFrom(this.organizationApi.getCurrentPhysiotherapist());
    const physiotherapist = this.mapPhysiotherapist(resource);
    this.currentPhysiotherapistSignal.set(physiotherapist);
    this.currentPhysiotherapistResolvedSignal.set(true);
    return physiotherapist;
  }

  async loadClinicPhysiotherapists(): Promise<PhysiotherapistProfile[]> {
    this.loadingPhysiotherapistsSignal.set(true);
    try {
      const resources = await firstValueFrom(this.organizationApi.getClinicPhysiotherapists());
      const physiotherapists = resources.map((resource) => this.mapPhysiotherapist(resource));
      this.physiotherapistsSignal.set(physiotherapists);
      return physiotherapists;
    } finally {
      this.loadingPhysiotherapistsSignal.set(false);
    }
  }

  async loadClinicPhysiotherapistById(id: string): Promise<PhysiotherapistProfile> {
    this.loadingSelectedPhysiotherapistSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.getClinicPhysiotherapistById(id));
      const physiotherapist = this.mapPhysiotherapist(resource);
      this.selectedPhysiotherapistSignal.set(physiotherapist);
      return physiotherapist;
    } finally {
      this.loadingSelectedPhysiotherapistSignal.set(false);
    }
  }

  async registerPhysiotherapistAsClinicAdmin(
    command: RegisterPhysiotherapistCommand,
  ): Promise<PhysiotherapistProfile> {
    this.registeringPhysiotherapistSignal.set(true);
    try {
      const resource = await firstValueFrom(
        this.organizationApi.registerPhysiotherapistAsClinicAdmin(command),
      );
      const physiotherapist = this.mapPhysiotherapist(resource);
      this.physiotherapistsSignal.update((physiotherapists) => [
        physiotherapist,
        ...physiotherapists,
      ]);
      return physiotherapist;
    } finally {
      this.registeringPhysiotherapistSignal.set(false);
    }
  }

  async updatePhysiotherapist(
    id: string,
    command: UpdatePhysiotherapistCommand,
  ): Promise<PhysiotherapistProfile> {
    this.updatingPhysiotherapistSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.updatePhysiotherapist(id, command));
      return this.syncPhysiotherapistResource(resource);
    } finally {
      this.updatingPhysiotherapistSignal.set(false);
    }
  }

  async suspendPhysiotherapist(id: string): Promise<void> {
    this.suspendingPhysiotherapistSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.suspendPhysiotherapist(id));
      await this.refreshAfterPhysiotherapistMutation(id, { clearIfMissing: false });
    } finally {
      this.suspendingPhysiotherapistSignal.set(false);
    }
  }

  async reactivatePhysiotherapist(id: string): Promise<void> {
    this.reactivatingPhysiotherapistSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.reactivatePhysiotherapist(id));
      await this.refreshAfterPhysiotherapistMutation(id, { clearIfMissing: false });
    } finally {
      this.reactivatingPhysiotherapistSignal.set(false);
    }
  }

  async deletePhysiotherapist(id: string): Promise<void> {
    this.deletingPhysiotherapistSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.deletePhysiotherapist(id));
      this.physiotherapistsSignal.update((physiotherapists) =>
        physiotherapists.filter((physiotherapist) => physiotherapist.id !== id),
      );
      if (this.selectedPhysiotherapistSignal()?.id === id) {
        this.selectedPhysiotherapistSignal.set(null);
      }
      if (this.viewedPhysiotherapistPatientsIdSignal() === id) {
        this.patientsByPhysiotherapistSignal.set([]);
        this.viewedPhysiotherapistPatientsIdSignal.set(null);
      }
      await this.loadClinicPatients();
    } finally {
      this.deletingPhysiotherapistSignal.set(false);
    }
  }

  async loadClinicPatients(): Promise<Patient[]> {
    this.loadingPatientsSignal.set(true);
    try {
      const resources = await firstValueFrom(this.organizationApi.getClinicPatients());
      const patients = resources.map((resource) => this.mapPatient(resource));
      this.patientsSignal.set(patients);
      return patients;
    } finally {
      this.loadingPatientsSignal.set(false);
    }
  }

  async loadPatientsByClinicId(clinicId: string): Promise<Patient[]> {
    this.loadingPatientsSignal.set(true);
    try {
      const resources = await firstValueFrom(
        this.organizationApi.getClinicPatientsByClinicId(clinicId),
      );
      const patients = resources.map((resource) => this.mapPatient(resource));
      this.patientsSignal.set(patients);
      return patients;
    } finally {
      this.loadingPatientsSignal.set(false);
    }
  }

  async loadPatientsByPhysiotherapistId(physiotherapistId: string): Promise<Patient[]> {
    this.loadingPatientsByPhysiotherapistSignal.set(true);
    this.viewedPhysiotherapistPatientsIdSignal.set(physiotherapistId);
    try {
      const resources = await firstValueFrom(
        this.organizationApi.getPatientsByPhysiotherapistId(physiotherapistId),
      );
      const patients = resources.map((resource) => this.mapPatient(resource));
      this.patientsByPhysiotherapistSignal.set(patients);
      return patients;
    } finally {
      this.loadingPatientsByPhysiotherapistSignal.set(false);
    }
  }

  async loadMyPatients(): Promise<Patient[]> {
    this.loadingPatientsSignal.set(true);
    try {
      const resources = await firstValueFrom(this.organizationApi.getMyPatients());
      const patients = resources.map((resource) => this.mapPatient(resource));
      this.patientsSignal.set(patients);
      return patients;
    } finally {
      this.loadingPatientsSignal.set(false);
    }
  }

  async loadPatientById(id: string): Promise<Patient> {
    this.loadingSelectedPatientSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.getPatientById(id));
      const patient = this.mapPatient(resource);
      this.selectedPatientSignal.set(patient);
      return patient;
    } finally {
      this.loadingSelectedPatientSignal.set(false);
    }
  }

  async registerPatientAsClinicAdmin(command: RegisterPatientCommand): Promise<Patient> {
    this.registeringPatientSignal.set(true);
    try {
      const resource = await firstValueFrom(
        this.organizationApi.registerPatientAsClinicAdmin(command),
      );
      const patient = this.mapPatient(resource);
      this.patientsSignal.update((patients) => [patient, ...patients]);
      return patient;
    } finally {
      this.registeringPatientSignal.set(false);
    }
  }

  /**
   * @deprecated Kept for compatibility with the physiotherapist registration flow.
   */
  async registerPatient(command: RegisterPatientCommand): Promise<Patient> {
    this.registeringPatientSignal.set(true);
    try {
      const resource = await firstValueFrom(
        this.organizationApi.registerPatientAsPhysiotherapist(command),
      );
      const patient = this.mapPatient(resource);
      this.patientsSignal.update((patients) => [patient, ...patients]);
      return patient;
    } finally {
      this.registeringPatientSignal.set(false);
    }
  }

  async assignPatient(patientId: string, command: AssignPatientCommand): Promise<void> {
    this.assigningPatientSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.assignPatient(patientId, command));
      this.patientsSignal.update((patients) =>
        patients.map((patient) =>
          patient.id === patientId
            ? this.clonePatientWithAssignment(patient, command.physiotherapistId)
            : patient,
        ),
      );

      const selectedPatient = this.selectedPatientSignal();
      if (selectedPatient?.id === patientId) {
        this.selectedPatientSignal.set(
          this.clonePatientWithAssignment(selectedPatient, command.physiotherapistId),
        );
      }

      this.syncPatientsByPhysiotherapistAfterAssignment(patientId, command.physiotherapistId);
    } finally {
      this.assigningPatientSignal.set(false);
    }
  }

  async dischargePatient(id: string): Promise<void> {
    this.dischargingPatientSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.dischargePatient(id));
      this.patientsSignal.update((patients) =>
        patients.map((patient) =>
          patient.id === id ? this.clonePatientWithStatus(patient, 'DISCHARGED') : patient,
        ),
      );
      this.patientsByPhysiotherapistSignal.update((patients) =>
        patients.map((patient) =>
          patient.id === id ? this.clonePatientWithStatus(patient, 'DISCHARGED') : patient,
        ),
      );

      const selectedPatient = this.selectedPatientSignal();
      if (selectedPatient?.id === id) {
        this.selectedPatientSignal.set(this.clonePatientWithStatus(selectedPatient, 'DISCHARGED'));
      }
    } finally {
      this.dischargingPatientSignal.set(false);
    }
  }

  async updatePatientAsPhysiotherapist(
    id: string,
    command: UpdatePatientContactCommand,
  ): Promise<Patient> {
    this.updatingPatientSignal.set(true);
    try {
      const resource = await firstValueFrom(
        this.organizationApi.updatePatientAsPhysiotherapist(id, command),
      );
      return this.syncPatientResource(resource);
    } finally {
      this.updatingPatientSignal.set(false);
    }
  }

  async updatePatientAsClinicAdmin(
    id: string,
    command: UpdatePatientByClinicAdminCommand,
  ): Promise<Patient> {
    this.updatingPatientSignal.set(true);
    try {
      const previousPatient = this.patientsSignal().find((patient) => patient.id === id) ?? null;
      const resource = await firstValueFrom(this.organizationApi.updatePatientAsClinicAdmin(id, command));
      const patient = this.syncPatientResource(resource);
      const viewedPhysiotherapistId = this.viewedPhysiotherapistPatientsIdSignal();
      const previousAssignedId = previousPatient?.assignedPhysiotherapistId ?? null;
      const nextAssignedId = patient.assignedPhysiotherapistId;

      if (
        viewedPhysiotherapistId &&
        (viewedPhysiotherapistId === previousAssignedId || viewedPhysiotherapistId === nextAssignedId)
      ) {
        await this.loadPatientsByPhysiotherapistId(viewedPhysiotherapistId);
      }

      return patient;
    } finally {
      this.updatingPatientSignal.set(false);
    }
  }

  async deletePatient(id: string): Promise<void> {
    this.deletingPatientSignal.set(true);
    try {
      await firstValueFrom(this.organizationApi.deletePatient(id));
      this.patientsSignal.update((patients) => patients.filter((patient) => patient.id !== id));
      this.patientsByPhysiotherapistSignal.update((patients) =>
        patients.filter((patient) => patient.id !== id),
      );
      if (this.selectedPatientSignal()?.id === id) {
        this.selectedPatientSignal.set(null);
      }
    } finally {
      this.deletingPatientSignal.set(false);
    }
  }

  private mapClinicProfile(resource: ClinicProfileResource): ClinicProfile {
    return new ClinicProfile({
      id: resource.id,
      legalName: resource.legalName,
      commercialName: resource.commercialName,
      ruc: resource.ruc,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      address: new ClinicAddressValue({
        countryCode: resource.address.countryCode,
        region: resource.address.region,
        city: resource.address.city,
        addressLine1: resource.address.addressLine1,
        addressLine2: resource.address.addressLine2,
        postalCode: resource.address.postalCode,
      }),
    });
  }

  private mapClinicAdmin(resource: ClinicAdminProfileResource): ClinicAdminProfile {
    return new ClinicAdminProfile({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      dni: resource.dni,
      birthDate: resource.birthDate,
      gender: resource.gender,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      clinicId: resource.clinicId,
    });
  }

  private mapPhysiotherapist(resource: PhysiotherapistProfileResource): PhysiotherapistProfile {
    return new PhysiotherapistProfile({
      id: resource.id,
      userId: resource.userId,
      clinicId: resource.clinicId,
      fullName: resource.fullName,
      specialty: resource.specialty,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      licenseNumber: resource.licenseNumber,
      professionalSummary: resource.professionalSummary,
      photoUrl: resource.photoUrl,
      yearsOfExperience: resource.yearsOfExperience,
      hireDate: resource.hireDate,
      status: resource.status,
    });
  }

  private mapPatient(resource: PatientResource): Patient {
    return new Patient({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      dni: resource.dni,
      birthDate: resource.birthDate,
      gender: resource.gender,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      medicalCondition: resource.medicalCondition,
      assignedPhysiotherapistId: resource.assignedPhysiotherapistId,
      status: resource.status,
      clinicId: resource.clinicId,
    });
  }

  private clonePatientWithStatus(patient: Patient, status: string): Patient {
    return new Patient({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dni: patient.dni,
      birthDate: patient.birthDate,
      gender: patient.gender,
      email: patient.email,
      countryCode: patient.countryCode,
      phoneNumber: patient.phoneNumber,
      medicalCondition: patient.medicalCondition,
      assignedPhysiotherapistId: patient.assignedPhysiotherapistId,
      status,
      clinicId: patient.clinicId,
    });
  }

  private clonePatientWithAssignment(
    patient: Patient,
    assignedPhysiotherapistId: string | null,
  ): Patient {
    return new Patient({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dni: patient.dni,
      birthDate: patient.birthDate,
      gender: patient.gender,
      email: patient.email,
      countryCode: patient.countryCode,
      phoneNumber: patient.phoneNumber,
      medicalCondition: patient.medicalCondition,
      assignedPhysiotherapistId,
      status: patient.status,
      clinicId: patient.clinicId,
    });
  }

  private syncPatientsByPhysiotherapistAfterAssignment(
    patientId: string,
    assignedPhysiotherapistId: string | null,
  ) {
    const currentViewedPhysiotherapistId = this.viewedPhysiotherapistPatientsIdSignal();
    if (!currentViewedPhysiotherapistId) return;

    const assignedPatient = this.patients().find((patient) => patient.id === patientId);
    if (!assignedPatient) return;

    this.patientsByPhysiotherapistSignal.update((patients) => {
      const filtered = patients.filter((patient) => patient.id !== patientId);
      if (assignedPhysiotherapistId === currentViewedPhysiotherapistId) {
        return [assignedPatient, ...filtered];
      }
      return filtered;
    });
  }

  private syncPatientResource(resource: PatientResource): Patient {
    const patient = this.mapPatient(resource);
    this.patientsSignal.update((patients) => {
      const existing = patients.some((item) => item.id === patient.id);
      return existing ? patients.map((item) => (item.id === patient.id ? patient : item)) : patients;
    });
    this.patientsByPhysiotherapistSignal.update((patients) => {
      const existing = patients.some((item) => item.id === patient.id);
      return existing ? patients.map((item) => (item.id === patient.id ? patient : item)) : patients;
    });
    if (this.selectedPatientSignal()?.id === patient.id) {
      this.selectedPatientSignal.set(patient);
    }
    return patient;
  }

  private syncPhysiotherapistResource(
    resource: PhysiotherapistProfileResource,
  ): PhysiotherapistProfile {
    const physiotherapist = this.mapPhysiotherapist(resource);
    this.physiotherapistsSignal.update((physiotherapists) => {
      const existing = physiotherapists.some((item) => item.id === physiotherapist.id);
      return existing
        ? physiotherapists.map((item) => (item.id === physiotherapist.id ? physiotherapist : item))
        : physiotherapists;
    });
    if (this.selectedPhysiotherapistSignal()?.id === physiotherapist.id) {
      this.selectedPhysiotherapistSignal.set(physiotherapist);
    }
    if (this.currentPhysiotherapistSignal()?.id === physiotherapist.id) {
      this.currentPhysiotherapistSignal.set(physiotherapist);
    }
    return physiotherapist;
  }

  private isMissingClinicAdminProfileError(error: unknown): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 404 || error.error?.code === 'NOT_FOUND';
    }

    if (!isAppError(error)) {
      return false;
    }

    return error.status === 404 || error.code === 'NOT_FOUND' || error.code === 'HTTP_404';
  }

  private async refreshAfterPhysiotherapistMutation(
    id: string,
    options: { clearIfMissing: boolean },
  ): Promise<void> {
    await this.loadClinicPhysiotherapists();
    await this.loadClinicPatients();

    const stillExists = this.physiotherapistsSignal().some((physiotherapist) => physiotherapist.id === id);
    if (!stillExists && options.clearIfMissing) {
      if (this.selectedPhysiotherapistSignal()?.id === id) {
        this.selectedPhysiotherapistSignal.set(null);
      }
      if (this.viewedPhysiotherapistPatientsIdSignal() === id) {
        this.patientsByPhysiotherapistSignal.set([]);
        this.viewedPhysiotherapistPatientsIdSignal.set(null);
      }
      return;
    }

    if (this.selectedPhysiotherapistSignal()?.id === id || this.viewedPhysiotherapistPatientsIdSignal() === id) {
      await this.loadClinicPhysiotherapistById(id);
      await this.loadPatientsByPhysiotherapistId(id);
    }
  }

  private formatAddress(clinic: ClinicProfile | null): string {
    if (!clinic) return 'Address pending';
    const addressParts = [
      clinic.address.addressLine1,
      clinic.address.addressLine2,
      clinic.address.city,
      clinic.address.region,
      clinic.address.postalCode,
    ].filter(Boolean);
    return addressParts.join(', ');
  }

  private formatPhone(clinic: ClinicProfile | null): string {
    if (!clinic) return '—';
    return `${clinic.countryCode} ${clinic.phoneNumber}`.trim();
  }

  private initialsFromName(fullName: string): string {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('');
  }

  private numericIdFromString(id: string): number {
    const digits = id.replace(/\D/g, '').slice(0, 9);
    return digits ? Number(digits) : 0;
  }

  private toLegacySpecializedRole(
    specialty: string,
  ): 'neuro-rehab' | 'post-op-recovery' | 'geriatric-mobility' | 'iot-mobility' | 'sports-rehab' {
    switch (specialty) {
      case 'NEUROLOGICAL':
        return 'neuro-rehab';
      case 'SPORTS':
        return 'sports-rehab';
      case 'TRAUMATOLOGICAL':
        return 'post-op-recovery';
      case 'GENERAL':
      default:
        return 'geriatric-mobility';
    }
  }
}
