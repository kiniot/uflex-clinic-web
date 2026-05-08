import {ClinicalTrajectory} from '../domain/model/clinical-trajectory';

/**
 * Mock long-term trajectory for the active rehab program. Will be
 * replaced by GET /rehab-programs/:id/trajectory when the backend
 * lands.
 */
export const MOCK_CLINICAL_TRAJECTORY: ClinicalTrajectory = {
  estimatedRtpDateLabel: 'Oct 14, 2024',
  scheduleStatus: 'ahead',
  complianceScorePct: 94,
  complianceLabel: 'Excellent engagement',
  riskLevel: 'low'
};
