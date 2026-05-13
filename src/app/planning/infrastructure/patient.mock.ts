import {Patient} from '../domain/model/patient.entity';

/**
 * In-memory patient list used while the Planning backend is not yet
 * wired. Replace with an HTTP endpoint + assembler once the API ships.
 */
export const MOCK_PATIENTS: Patient[] = [
  new Patient({
    id: 1,
    name: 'Sarah Jenkins',
    mrn: 'MRN-902-11',
    condition: 'Post-Op ACL Recovery',
    status: 'active',
    avatarInitials: 'SJ'
  }),
  new Patient({
    id: 2,
    name: 'Arthur Vance',
    mrn: 'MRN-788-04',
    condition: 'Total Hip Replacement',
    status: 'active',
    avatarInitials: 'AV'
  }),
  new Patient({
    id: 3,
    name: 'Elena Rodriguez',
    mrn: 'MRN-223-99',
    condition: 'Chronic Knee Pain',
    status: 'waitlist',
    avatarInitials: 'ER'
  })
];
