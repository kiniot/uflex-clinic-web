import {ClinicEfficiencyKpi, IotFleetHealthSnapshot, StaffSummary} from '../domain/model/organization-overview';
import {StaffClinician} from '../domain/model/staff-clinician.entity';
import {UnassignedPatient} from '../domain/model/unassigned-patient.entity';

export const MOCK_STAFF_SUMMARY: StaffSummary = {
  totalStaff: 24,
  avgProductivityPct: 88
};

export const MOCK_UNASSIGNED_PATIENTS: UnassignedPatient[] = [
  new UnassignedPatient({
    id: 11,
    name: 'Sarah Jenkins',
    condition: 'Post-Op Hip Replacement',
    arrivedLabel: '2 days ago',
    tags: ['critical-care', 'home-visit']
  }),
  new UnassignedPatient({
    id: 12,
    name: 'Robert Chen',
    condition: 'ACL Reconstruction',
    arrivedLabel: '4 days ago',
    tags: ['outpatient', 'iot-syncing']
  })
];

export const MOCK_UNASSIGNED_TOTAL = 7;

export const MOCK_STAFF_DIRECTORY: StaffClinician[] = [
  new StaffClinician({
    id: 21,
    name: 'Dr. Aris Thorne',
    email: 'aris.t@uflex.clinic',
    specialization: 'Neurological Rehab',
    caseloadCurrent: 18,
    caseloadMax: 20,
    avatarInitials: 'AT'
  }),
  new StaffClinician({
    id: 22,
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@uflex.clinic',
    specialization: 'Sports Medicine',
    caseloadCurrent: 12,
    caseloadMax: 20,
    avatarInitials: 'ER'
  }),
  new StaffClinician({
    id: 23,
    name: 'James Wilson',
    email: 'j.wilson@uflex.clinic',
    specialization: 'Pediatric Rehab',
    caseloadCurrent: 20,
    caseloadMax: 20,
    avatarInitials: 'JW'
  }),
  new StaffClinician({
    id: 24,
    name: 'Maya Patel',
    email: 'm.patel@uflex.clinic',
    specialization: 'Geriatric Care',
    caseloadCurrent: 15,
    caseloadMax: 20,
    avatarInitials: 'MP'
  }),
  new StaffClinician({
    id: 25,
    name: "Kevin O'Brian",
    email: 'k.obrian@uflex.clinic',
    specialization: 'Cardiovascular Rehab',
    caseloadCurrent: 5,
    caseloadMax: 20,
    avatarInitials: 'KO'
  })
];

export const MOCK_FLEET_HEALTH_SNAPSHOT: IotFleetHealthSnapshot = {
  reportingPct: 98.2,
  onlineCount: 212,
  syncingCount: 4,
  hasZeroAlerts: true
};

export const MOCK_CLINIC_EFFICIENCY: ClinicEfficiencyKpi = {
  deltaPct: 12,
  body: 'Treatment throughput has improved by an average of 14 minutes per session this month.'
};
