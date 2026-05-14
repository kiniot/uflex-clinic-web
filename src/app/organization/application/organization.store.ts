import { Injectable, signal } from '@angular/core';
import { Clinic } from '../domain/model/clinic.entity';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import {
  ClinicEfficiencyKpi,
  IotFleetHealthSnapshot,
  StaffSummary,
} from '../domain/model/organization-overview';
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

  readonly clinic = this.clinicSignal.asReadonly();
  readonly teamMembers = this.teamMembersSignal.asReadonly();
  readonly unassignedPatients = this.unassignedSignal.asReadonly();
  readonly unassignedTotal = this.unassignedTotalSignal.asReadonly();
  readonly staffDirectory = this.staffDirectorySignal.asReadonly();
  readonly staffSummary = this.staffSummarySignal.asReadonly();
  readonly fleetHealthSnapshot = this.fleetHealthSignal.asReadonly();
  readonly clinicEfficiency = this.efficiencySignal.asReadonly();
  readonly latestCreatedClinic = this.latestCreatedClinicSignal.asReadonly();

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
}
