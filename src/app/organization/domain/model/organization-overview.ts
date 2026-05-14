export interface StaffSummary {
  totalStaff: number;
}

export interface IotFleetHealthSnapshot {
  reportingPct: number;
  onlineCount: number;
  syncingCount: number;
  hasZeroAlerts: boolean;
}