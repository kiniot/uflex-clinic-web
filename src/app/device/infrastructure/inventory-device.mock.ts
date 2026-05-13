import {InventoryDevice} from '../domain/model/inventory-device.entity';

/**
 * Mock inventory rows shown in the physiotherapist's Device Inventory
 * table. Will be replaced by GET /devices/inventory once the backend
 * exposes paginated rows.
 */
export const MOCK_INVENTORY_DEVICES: InventoryDevice[] = [
  new InventoryDevice({
    id: 1,
    deviceId: 'FX-2044-A',
    modelName: 'Flex-Sensor Gen 2',
    status: 'available',
    batteryPct: 98,
    lastSyncLabel: '14 mins ago',
    assignmentName: null
  }),
  new InventoryDevice({
    id: 2,
    deviceId: 'FX-1988-C',
    modelName: 'Flex-Sensor Gen 2',
    status: 'active',
    batteryPct: 42,
    lastSyncLabel: 'Connected',
    assignmentName: 'Sarah Jenkins'
  })
];

export const MOCK_INVENTORY_TOTAL = 184;
