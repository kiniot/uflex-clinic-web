/**
 * Snapshot of clinic-wide rehabilitation metrics shown in the
 * physiotherapist dashboard. Plain value object — no identity.
 */
export interface ClinicalMetrics {
  /** Adherence rate to prescribed programs over the current month. */
  complianceRatePct: number;
  /** Delta vs. previous month, used by the Monthly Progress bar. */
  monthlyProgressDeltaPct: number;
  /** Active patients currently under treatment. */
  activePatients: number;
  /** Patients newly enrolled in the past 7 days. */
  newPatientsThisWeek: number;
  /** Patients who hit a rehabilitation milestone this period. */
  recoveryMilestones: number;
  /** Goal achievement rate across active programs. */
  goalAchievementRatePct: number;
  /** Bar heights (0–100) for the Weekly Rehabilitation Velocity chart. */
  weeklyVelocityBars: number[];
  /** Clinic vs. national average delta for the same chart. */
  clinicVsNationalAvgDeltaPct: number;
  /** Sessions scheduled today, surfaced in the greeting line. */
  todaySessionCount: number;
  /** Of those, how many require immediate review. */
  todayUrgentCount: number;
}
