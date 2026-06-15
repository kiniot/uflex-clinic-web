import { TestBed } from '@angular/core/testing';
import { Device } from '../domain/model/device.entity';
import { DeviceStore } from './device.store';

describe('DeviceStore', () => {
  let store: DeviceStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(DeviceStore);

    const devices = [
      new Device({
        id: 'device-1',
        serialNumber: 'UFLEX-DEV-001',
        macAddress: 'AA:BB:CC:DD:EE:01',
        firmwareVersion: '1.0.0',
        batteryLevel: 95,
        model: 'UFlex Tracker Pro',
        advertisedName: 'UFLEX-DEV-001',
        calibrationStatus: 'VALID',
        status: 'AVAILABLE',
        lastSeenAt: new Date(),
        clinicId: 'clinic-1',
        currentPatientId: null,
        currentPatientFullName: null,
        offline: false,
      }),
      new Device({
        id: 'device-2',
        serialNumber: 'UFLEX-DEV-002',
        macAddress: 'AA:BB:CC:DD:EE:02',
        firmwareVersion: '1.0.0',
        batteryLevel: 72,
        model: 'UFlex Tracker Pro',
        advertisedName: 'UFLEX-DEV-002',
        calibrationStatus: 'VALID',
        status: 'ASSIGNED',
        lastSeenAt: new Date(),
        clinicId: 'clinic-1',
        currentPatientId: 'patient-1',
        currentPatientFullName: 'Maria Lopez',
        offline: false,
      }),
      new Device({
        id: 'device-3',
        serialNumber: 'UFLEX-DEV-003',
        macAddress: 'AA:BB:CC:DD:EE:03',
        firmwareVersion: '1.0.0',
        batteryLevel: 18,
        model: 'UFlex Tracker Pro',
        advertisedName: null,
        calibrationStatus: 'NEEDS_CALIBRATION',
        status: 'IN_MAINTENANCE',
        lastSeenAt: null,
        clinicId: 'clinic-1',
        currentPatientId: null,
        currentPatientFullName: null,
        offline: true,
      }),
      new Device({
        id: 'device-4',
        serialNumber: 'UFLEX-DEV-004',
        macAddress: 'AA:BB:CC:DD:EE:04',
        firmwareVersion: '1.0.0',
        batteryLevel: 48,
        model: 'UFlex Tracker Pro',
        advertisedName: 'ROOM-12',
        calibrationStatus: 'VALID',
        status: 'RETIRED',
        lastSeenAt: new Date(),
        clinicId: 'clinic-1',
        currentPatientId: null,
        currentPatientFullName: null,
        offline: false,
      }),
    ];

    (store as unknown as { devicesSignal: { set: (value: Device[]) => void } }).devicesSignal.set(
      devices,
    );
  });

  it('counts every device whose status is not offline as an active kit', () => {
    // 4 mocked devices, one retired -> 3 active kits by current store rule.
    expect(store.totalActiveKits()).toBe(3);
  });

  it('counts the devices that need recalibration', () => {
    // Only device-3 needs calibration in the seeded state.
    expect(store.requiresCalibration()).toBe(1);
  });

  it('computes the online percentage as a rounded ratio', () => {
    // 3 devices online out of 4 -> 75%.
    expect(store.onlinePercentage()).toBe(75);
  });

  it('computes the available units percentage from the fleet connectivity snapshot', () => {
    const snapshot = store.fleetMetrics();
    const expected =
      snapshot.total === 0 ? 0 : Math.round((snapshot.available / snapshot.total) * 100);

    expect(store.availableUnitsPct()).toBe(expected);
  });
});
