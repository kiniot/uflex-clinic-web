import {BatteryHealth, ConnectivityGateway, FleetConnectivity} from '../domain/model/fleet-snapshot';

export const MOCK_FLEET_CONNECTIVITY: FleetConnectivity = {
  activeDevices: 142,
  activeDeltaPct: 4,
  availableUnits: 38,
  totalUnits: 184,
  inServiceUnits: 4
};

export const MOCK_BATTERY_HEALTH: BatteryHealth = {
  highCount: 112,
  midCount: 64,
  lowCount: 8
};

export const MOCK_CONNECTIVITY_GATEWAY: ConnectivityGateway = {
  status: 'stable',
  uptimeLabel: '99.9% uptime'
};
