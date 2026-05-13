/**
 * Aggregate counts for the Fleet Connectivity card. Pure value object.
 */
export interface FleetConnectivity {
  /** Devices currently active (paired and reporting). */
  activeDevices: number;
  /** Week-over-week percentage change in active devices. */
  activeDeltaPct: number;
  /** Devices ready to assign but currently unpaired. */
  availableUnits: number;
  /** Total fleet size — denominator for the available-units bar. */
  totalUnits: number;
  /** Devices undergoing maintenance or out for repair. */
  inServiceUnits: number;
}

/**
 * Battery-bucket distribution across the fleet. Pure value object.
 */
export interface BatteryHealth {
  highCount: number;
  midCount: number;
  lowCount: number;
}

/**
 * Status of the local clinic gateway exposing the Bluetooth mesh.
 */
export interface ConnectivityGateway {
  status: 'stable' | 'degraded' | 'down';
  uptimeLabel: string;
}
