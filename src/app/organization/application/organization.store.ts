import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Clinic } from '../domain/model/clinic.entity';
import { ClinicAddressValue } from '../domain/model/clinic-address.value';
import { ClinicProfile } from '../domain/model/clinic-profile.entity';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import {
  ClinicEfficiencyKpi,
  IotFleetHealthSnapshot,
  StaffSummary,
} from '../domain/model/organization-overview';
import { Patient } from '../domain/model/patient.entity';
import { PhysiotherapistProfile } from '../domain/model/physiotherapist-profile.entity';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { StaffClinician } from '../domain/model/staff-clinician.entity';
import { TeamMember } from '../domain/model/team-member.entity';
import { UnassignedPatient } from '../domain/model/unassigned-patient.entity';
import { OrganizationApi } from '../infrastructure/organization-api';
import { ClinicResource } from '../infrastructure/create-clinic-response';
import { MOCK_CLINIC, MOCK_TEAM_MEMBERS } from '../infrastructure/organization.mock';
import {
  MOCK_CLINIC_EFFICIENCY,
  MOCK_FLEET_HEALTH_SNAPSHOT,
  MOCK_STAFF_DIRECTORY,
  MOCK_STAFF_SUMMARY,
  MOCK_UNASSIGNED_PATIENTS,
  MOCK_UNASSIGNED_TOTAL,
} from '../infrastructure/organization-overview.mock';

/**
 * Application-layer store for the Organization bounded context. Holds
 * the clinic + team members consumed by the clinic admin's view, plus
 * the unassigned-patient queue, staff directory, and aggregate KPIs
 * shown in the physiotherapist's Organization View.
 *
 * Hydrated from mocks until the Organization API is wired.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationStore {
  private readonly clinicSignal = signal<Clinic>(MOCK_CLINIC);
  private readonly teamMembersSignal = signal<TeamMember[]>(MOCK_TEAM_MEMBERS);
  private readonly unassignedSignal = signal<UnassignedPatient[]>(MOCK_UNASSIGNED_PATIENTS);
  private readonly unassignedTotalSignal = signal<number>(MOCK_UNASSIGNED_TOTAL);
  private readonly staffDirectorySignal = signal<StaffClinician[]>(MOCK_STAFF_DIRECTORY);
  private readonly staffSummarySignal = signal<StaffSummary>(MOCK_STAFF_SUMMARY);
  private readonly fleetHealthSignal = signal<IotFleetHealthSnapshot>(MOCK_FLEET_HEALTH_SNAPSHOT);
  private readonly efficiencySignal = signal<ClinicEfficiencyKpi>(MOCK_CLINIC_EFFICIENCY);
  private readonly latestCreatedClinicSignal = signal<ClinicResource | null>(null);
  private readonly currentClinicSignal = signal<ClinicProfile | null>(null);
  private readonly currentPhysiotherapistSignal = signal<PhysiotherapistProfile | null>(null);
  private readonly patientsSignal = signal<Patient[]>([]);
  private readonly selectedPatientSignal = signal<Patient | null>(null);
  private readonly loadingPatientsSignal = signal(false);
  private readonly loadingSelectedPatientSignal = signal(false);
  private readonly registeringPatientSignal = signal(false);
  private readonly dischargingPatientSignal = signal(false);
  private readonly currentClinicResolvedSignal = signal(false);
  private readonly currentPhysiotherapistResolvedSignal = signal(false);

  readonly clinic = this.clinicSignal.asReadonly();
  readonly teamMembers = this.teamMembersSignal.asReadonly();
  readonly unassignedPatients = this.unassignedSignal.asReadonly();
  readonly unassignedTotal = this.unassignedTotalSignal.asReadonly();
  readonly staffDirectory = this.staffDirectorySignal.asReadonly();
  readonly staffSummary = this.staffSummarySignal.asReadonly();
  readonly fleetHealthSnapshot = this.fleetHealthSignal.asReadonly();
  readonly clinicEfficiency = this.efficiencySignal.asReadonly();
  readonly latestCreatedClinic = this.latestCreatedClinicSignal.asReadonly();
  readonly currentClinic = this.currentClinicSignal.asReadonly();
  readonly currentPhysiotherapist = this.currentPhysiotherapistSignal.asReadonly();
  readonly patients = this.patientsSignal.asReadonly();
  readonly selectedPatient = this.selectedPatientSignal.asReadonly();
  readonly isLoadingPatients = this.loadingPatientsSignal.asReadonly();
  readonly isLoadingSelectedPatient = this.loadingSelectedPatientSignal.asReadonly();
  readonly isRegisteringPatient = this.registeringPatientSignal.asReadonly();
  readonly isDischargingPatient = this.dischargingPatientSignal.asReadonly();
  readonly inTreatmentPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'IN_TREATMENT').length,
  );
  readonly dischargedPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'DISCHARGED').length,
  );
  readonly registeredPatientsCount = computed(
    () => this.patients().filter((patient) => patient.status === 'REGISTERED').length,
  );

  constructor(private organizationApi: OrganizationApi) {}

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

  async loadCurrentClinicOnce({ force = false }: { force?: boolean } = {}): Promise<ClinicProfile | null> {
    if (this.currentClinicResolvedSignal() && !force) {
      return this.currentClinicSignal();
    }

    const resource = await firstValueFrom(this.organizationApi.getCurrentClinic());
    const clinic = new ClinicProfile({
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
    this.currentClinicSignal.set(clinic);
    this.currentClinicResolvedSignal.set(true);
    return clinic;
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
    const physiotherapist = new PhysiotherapistProfile({
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
    this.currentPhysiotherapistSignal.set(physiotherapist);
    this.currentPhysiotherapistResolvedSignal.set(true);
    return physiotherapist;
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

  async registerPatient(command: RegisterPatientCommand): Promise<Patient> {
    this.registeringPatientSignal.set(true);
    try {
      const resource = await firstValueFrom(this.organizationApi.registerPatientAsPhysiotherapist(command));
      const patient = this.mapPatient(resource);
      this.patientsSignal.update((patients) => [patient, ...patients]);
      return patient;
    } finally {
      this.registeringPatientSignal.set(false);
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

      const selectedPatient = this.selectedPatientSignal();
      if (selectedPatient?.id === id) {
        this.selectedPatientSignal.set(this.clonePatientWithStatus(selectedPatient, 'DISCHARGED'));
      }
    } finally {
      this.dischargingPatientSignal.set(false);
    }
  }

  private mapPatient(resource: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition: string;
    assignedPhysiotherapistId: string | null;
    status: string;
    clinicId: string;
  }): Patient {
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
}
