import {TherapyPatient} from '../domain/model/therapy-patient.entity';

/**
 * Mock therapy roster shown to the physiotherapist. The four rows here
 * mirror the Figma; in production the list comes from
 * GET /therapy/patients?clinician=me with proper pagination.
 */
export const MOCK_THERAPY_PATIENTS: TherapyPatient[] = [
  new TherapyPatient({
    id: 1,
    name: 'Julianne Moore',
    mrn: 'PX-9921',
    avatarInitials: 'JM',
    injuryContext: 'Ankle Ligament Grade II',
    injuryIcon: 'pi-bolt',
    lastSessionDateLabel: 'Oct 24, 2023',
    lastSessionTimeLabel: '02:30 PM',
    iotStatus: 'connected'
  }),
  new TherapyPatient({
    id: 2,
    name: 'Marcus Aurelius',
    mrn: 'PX-8844',
    avatarInitials: 'MA',
    injuryContext: 'Post-Op ACL Rehab',
    injuryIcon: 'pi-circle-fill',
    lastSessionDateLabel: 'Oct 22, 2023',
    lastSessionTimeLabel: '11:15 AM',
    iotStatus: 'offline'
  }),
  new TherapyPatient({
    id: 3,
    name: 'Sienna Miller',
    mrn: 'PX-9782',
    avatarInitials: 'SM',
    injuryContext: 'Rotator Cuff Tear',
    injuryIcon: 'pi-arrow-up',
    lastSessionDateLabel: 'Yesterday',
    lastSessionTimeLabel: '09:00 AM',
    iotStatus: 'connected'
  }),
  new TherapyPatient({
    id: 4,
    name: 'Arthur Morgan',
    mrn: 'PX-9102',
    avatarInitials: 'AM',
    injuryContext: 'Lower Back Spondylosis',
    injuryIcon: 'pi-sort-alt',
    lastSessionDateLabel: 'Oct 19, 2023',
    lastSessionTimeLabel: '04:45 PM',
    iotStatus: 'connected'
  })
];
