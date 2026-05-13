/**
 * Snapshot of the clinic's therapy operation rendered as KPI cards
 * above the patient roster. Pure value object — no identity.
 */
export interface TherapyOverview {
  /** Recovery velocity for the current month, as a percentage. */
  throughputPct: number;
  /** Delta vs. previous month, used by the throughput card's chevron. */
  throughputDeltaPct: number;
  /** IoT devices currently linked to active patients. */
  activeDevices: number;
  /** Total IoT devices the clinic is licensed to deploy. */
  totalDevices: number;
  /** Reviews waiting for the clinician's assessment. */
  pendingReviews: number;
  /** Total active patients in the roster (used in the footer counter). */
  totalActivePatients: number;
}
