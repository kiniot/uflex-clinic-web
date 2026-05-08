/** Risk classification driving the trajectory card's bar indicator. */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Long-term trajectory snapshot rendered at the bottom of the Therapy
 * Roadmap. Pure value object — no identity.
 */
export interface ClinicalTrajectory {
  /** Estimated return-to-play date as a display label. */
  estimatedRtpDateLabel: string;
  /** Whether the patient is ahead of, on, or behind schedule. */
  scheduleStatus: 'ahead' | 'on-track' | 'behind';
  /** Compliance score 0–100 surfaced under the chart. */
  complianceScorePct: number;
  /** Short qualitative label paired with the score. */
  complianceLabel: string;
  /** Risk classification for re-injury. */
  riskLevel: RiskLevel;
}
