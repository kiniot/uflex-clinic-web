import {ClinicalMetrics} from '../domain/model/clinical-metrics';

/**
 * Mock clinical metrics snapshot shown in the dashboard. Will be
 * replaced by GET /metrics/clinical-summary once the backend lands.
 */
export const MOCK_CLINICAL_METRICS: ClinicalMetrics = {
  complianceRatePct: 84.2,
  monthlyProgressDeltaPct: 5.4,
  activePatients: 42,
  newPatientsThisWeek: 3,
  recoveryMilestones: 18,
  goalAchievementRatePct: 72,
  weeklyVelocityBars: [42, 65, 88, 35, 70, 95, 55],
  clinicVsNationalAvgDeltaPct: 12,
  todaySessionCount: 8,
  todayUrgentCount: 3
};
