import {TherapyOverview} from '../domain/model/therapy-overview';

/**
 * Mock therapy overview snapshot rendered as KPI cards. Will be
 * replaced by GET /therapy/overview when the backend lands.
 */
export const MOCK_THERAPY_OVERVIEW: TherapyOverview = {
  throughputPct: 84,
  throughputDeltaPct: 12,
  activeDevices: 24,
  totalDevices: 50,
  pendingReviews: 8,
  totalActivePatients: 42
};
