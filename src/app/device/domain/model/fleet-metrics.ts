export interface FleetMetrics {
  total: number;
  available: number;
  assigned: number;
  inMaintenance: number;
  lowBattery: number;
  offline: number;
  /** Total kits the clinic's current subscription paid for. */
  requestedKits: number;
  /** Kits still pending shipment (requested minus kits the clinic already owns). */
  pendingKits: number;
}