import {Device} from '../domain/model/device.entity';

/**
 * In-memory device fleet stub used while the Device backend is not yet
 * wired. Replace with an HTTP endpoint + assembler once the API is ready.
 */
export const MOCK_DEVICES: Device[] = [
  new Device({
    id: 1,
    kitId: 'uF-2024-K82',
    linkedPatient: 'Elena Rostova',
    batteryLevel: 85,
    bluetoothConnected: true,
    calibrationStatus: 'valid',
    firmwareVersion: 'v3.1.0',
    status: 'online'
  }),
  new Device({
    id: 2,
    kitId: 'uF-2024-K83',
    linkedPatient: null,
    batteryLevel: 100,
    bluetoothConnected: true,
    calibrationStatus: 'valid',
    firmwareVersion: 'v3.1.0',
    status: 'idle'
  }),
  new Device({
    id: 3,
    kitId: 'uF-2023-A14',
    linkedPatient: 'Marcus Chen',
    batteryLevel: 12,
    bluetoothConnected: false,
    calibrationStatus: 'expired',
    firmwareVersion: 'v2.9.4',
    status: 'offline'
  }),
  new Device({
    id: 4,
    kitId: 'uF-2024-K91',
    linkedPatient: 'Sarah Jenkins',
    batteryLevel: 64,
    bluetoothConnected: true,
    calibrationStatus: 'valid',
    firmwareVersion: 'v3.1.0',
    status: 'online'
  })
];
