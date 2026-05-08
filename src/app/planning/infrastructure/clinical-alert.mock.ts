import {ClinicalAlert} from '../domain/model/clinical-alert.entity';

/**
 * Mock clinical alerts rendered in the dashboard's Urgent Alerts feed.
 * Will be replaced by GET /alerts?clinician=me when the backend lands.
 */
export const MOCK_CLINICAL_ALERTS: ClinicalAlert[] = [
  new ClinicalAlert({
    id: 1,
    patientName: 'Thomas Wade',
    agoLabel: '22M AGO',
    message: 'Excessive joint pressure detected during Home Rehab Level 2. Session halted.',
    severity: 'urgent',
    actions: [
      {label: 'Urgent Call', variant: 'primary'},
      {label: 'Dismiss', variant: 'secondary'}
    ]
  }),
  new ClinicalAlert({
    id: 2,
    patientName: 'Linda G.',
    agoLabel: '1H AGO',
    message: 'Compliance dropped below 40% for the past 48 hours. Follow-up required.',
    severity: 'warning',
    actions: [
      {label: 'Send Message', variant: 'secondary'}
    ]
  })
];
