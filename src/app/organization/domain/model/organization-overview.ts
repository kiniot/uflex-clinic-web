/** Aggregate counters rendered to the right of the page title. */
export interface StaffSummary {
  totalStaff: number;
  avgProductivityPct: number;
}

/**
 * Snapshot rendered in the IoT Fleet Health card at the bottom of the
 * Organization view.
 */
export interface IotFleetHealthSnapshot {
  reportingPct: number;
  onlineCount: number;
  syncingCount: number;
  hasZeroAlerts: boolean;
}

/**
 * Single KPI rendered next to the fleet health card.
 */
export interface ClinicEfficiencyKpi {
  deltaPct: number;
  body: string;
}
