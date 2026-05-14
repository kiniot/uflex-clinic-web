import {Injectable, signal, computed} from '@angular/core';
import {Clinic} from '../domain/model/clinic.entity';
import {IotFleetHealthSnapshot, StaffSummary} from '../domain/model/organization-overview';
import {Patient} from '../domain/model/patient.entity';
import {StaffClinician} from '../domain/model/staff-clinician.entity';
import {TeamMember} from '../domain/model/team-member.entity';
import {UnassignedPatient} from '../domain/model/unassigned-patient.entity';
import {OrganizationApi} from '../infrastructure/organization-api';

const MOCK_CLINIC: Clinic = new Clinic({
  id: '1',
  name: 'Nexus Rehab Center',
  addressLine: '122 Medical Parkway, Suite 400, Chicago, IL 60611',
  phone: '(312) 555-0198',
  totalPatients: 1248,
  patientsTrendPct: 12,
  activePhysiotherapists: 42,
  physiotherapistsOnLeave: 8,
  availableIotKits: 86,
  totalIotKits: 120
});

const MOCK_FLEET_HEALTH_SNAPSHOT: IotFleetHealthSnapshot = {
  reportingPct: 98.2,
  onlineCount: 212,
  syncingCount: 4,
  hasZeroAlerts: true
};

@Injectable({providedIn: 'root'})
export class OrganizationStore {
  private readonly api: OrganizationApi;

  private readonly clinicSignal = signal<Clinic>(MOCK_CLINIC);
  private readonly teamMembersSignal = signal<TeamMember[]>([]);
  private readonly unassignedSignal = signal<UnassignedPatient[]>([]);
  private readonly staffDirectorySignal = signal<StaffClinician[]>([]);
  private readonly fleetHealthSignal = signal<IotFleetHealthSnapshot>(MOCK_FLEET_HEALTH_SNAPSHOT);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly totalPatientsSignal = signal<number>(MOCK_CLINIC.totalPatients);
  private readonly allPatientsSignal = signal<Patient[]>([]);

  readonly clinic = this.clinicSignal.asReadonly();
  readonly teamMembers = this.teamMembersSignal.asReadonly();
  readonly unassignedPatients = this.unassignedSignal.asReadonly();
  readonly unassignedTotal = computed(() => this.unassignedSignal().length);
  readonly staffDirectory = this.staffDirectorySignal.asReadonly();
  readonly staffSummary = computed<StaffSummary>(() => ({
    totalStaff: this.teamMembersSignal().length
  }));
  readonly fleetHealthSnapshot = this.fleetHealthSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly totalPatients = this.totalPatientsSignal.asReadonly();
  readonly allPatients = this.allPatientsSignal.asReadonly();

  readonly activePhysiotherapistsCount = computed(() =>
    this.teamMembersSignal().filter(m => m.status === 'ACTIVE').length
  );

  readonly physiotherapistsOnLeaveCount = computed(() =>
    this.teamMembersSignal().filter(m => m.status !== 'ACTIVE').length
  );

  constructor(api: OrganizationApi) {
    this.api = api;
  }

  loadAll() {
    console.log('[OrganizationStore] loadAll() called');
    this.loadingSignal.set(true);

    this.api.getPhysiotherapists().subscribe({
      next: (physios) => {
        console.log('[OrganizationStore] getPhysiotherapists success:', physios.length, 'physios');
        this.teamMembersSignal.set(physios);
        this.staffDirectorySignal.set(physios.map(p => new StaffClinician({
          id: p.id,
          fullName: p.fullName,
          email: p.email,
          specialty: p.specialty,
          caseloadCurrent: p.activePatients,
          caseloadMax: 20
        })));
      },
      error: (err) => {
        console.error('[OrganizationStore] getPhysiotherapists error:', err);
        this.loadingSignal.set(false);
      }
    });

    this.api.getUnassignedPatients().subscribe({
      next: (unassigned) => {
        console.log('[OrganizationStore] getUnassignedPatients success:', unassigned.length, 'unassigned');
        this.unassignedSignal.set(unassigned);
      },
      error: (err) => {
        console.error('[OrganizationStore] getUnassignedPatients error:', err);
      }
    });

    this.api.getPatients().subscribe({
      next: (patients) => {
        console.log('[OrganizationStore] getPatients success:', patients.length, 'patients');
        this.totalPatientsSignal.set(patients.length);
        this.allPatientsSignal.set(patients);
      },
      error: (err) => {
        console.error('[OrganizationStore] getPatients error:', err);
      }
    });
  }

  registerPhysiotherapist(command: {
    fullName: string;
    specialty: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    licenseNumber: string;
    professionalSummary: string;
    photoUrl: string | null;
    yearsOfExperience: number;
  }) {
    return this.api.registerPhysiotherapist(command as any);
  }
}