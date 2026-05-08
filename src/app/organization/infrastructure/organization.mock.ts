import {Clinic} from '../domain/model/clinic.entity';
import {TeamMember} from '../domain/model/team-member.entity';

/**
 * In-memory clinic + staff stub for the Organization view while the
 * backend is not yet wired.
 */
export const MOCK_CLINIC = new Clinic({
  id: 1,
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

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  new TeamMember({
    id: 1,
    name: 'Dr. Sarah Jenkins',
    email: 'sarah@nexusrehab.com',
    role: 'neuro-rehab',
    activePatients: 24,
    status: 'active',
    avatarInitials: 'SJ'
  }),
  new TeamMember({
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'm.chen@nexusrehab.com',
    role: 'post-op-recovery',
    activePatients: 18,
    status: 'active',
    avatarInitials: 'MC'
  }),
  new TeamMember({
    id: 3,
    name: 'Dr. Elena Rodriguez',
    email: 'e.rod@nexusrehab.com',
    role: 'geriatric-mobility',
    activePatients: 0,
    status: 'on-leave',
    avatarInitials: 'ER'
  }),
  new TeamMember({
    id: 4,
    name: 'Marcus Sterling',
    email: 'm.sterling@nexusrehab.com',
    role: 'iot-mobility',
    activePatients: 31,
    status: 'active',
    avatarInitials: 'MS'
  })
];
