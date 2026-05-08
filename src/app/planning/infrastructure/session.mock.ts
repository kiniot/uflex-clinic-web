import {Session} from '../domain/model/session.entity';

/**
 * Mock daily schedule rendered in the physiotherapist dashboard. Will
 * be replaced by GET /sessions?date=today once the backend lands.
 */
export const MOCK_DAILY_SESSIONS: Session[] = [
  new Session({
    id: 101,
    timeLabel: '09:00 AM',
    patientName: 'Robert Chen',
    patientInitials: 'RC',
    focusArea: 'Knee Post-Op',
    iotStatus: 'connected'
  }),
  new Session({
    id: 102,
    timeLabel: '10:30 AM',
    patientName: 'Elena Rodriguez',
    patientInitials: 'ER',
    focusArea: 'Spinal Alignment',
    iotStatus: 'offline'
  }),
  new Session({
    id: 103,
    timeLabel: '01:00 PM',
    patientName: 'Marcus Thorne',
    patientInitials: 'MT',
    focusArea: 'Gait Analysis',
    iotStatus: 'connected'
  })
];
