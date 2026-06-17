export interface InventoryDevice {
  id: string;
  deviceId: string;
  serialNumber: string;
  modelName: string;
  status: string;
  batteryPct: number;
  lastSyncLabel: string | null;
  assignmentName: string | null;
}

export const MOCK_INVENTORY_DEVICES: InventoryDevice[] = [];

export const MOCK_INVENTORY_TOTAL = 0;

export interface FleetConnectivity {
  activeDevices: number;
  activeDeltaPct: number;
  availableUnits: number;
  inServiceUnits: number;
}

export const MOCK_FLEET_CONNECTIVITY: FleetConnectivity = {
  activeDevices: 0,
  activeDeltaPct: 0,
  availableUnits: 0,
  inServiceUnits: 0
};

export interface BatteryHealth {
  highCount: number;
  midCount: number;
  lowCount: number;
}

export const MOCK_BATTERY_HEALTH: BatteryHealth = {
  highCount: 0,
  midCount: 0,
  lowCount: 0
};

export interface ConnectivityGateway {
  status: string;
  uptimeLabel: string;
}

export const MOCK_CONNECTIVITY_GATEWAY: ConnectivityGateway = {
  status: 'online',
  uptimeLabel: '0h'
};