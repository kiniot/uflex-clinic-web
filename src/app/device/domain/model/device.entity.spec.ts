import { Device } from './device.entity';

describe('Device entity', () => {
  const buildDevice = (overrides: Partial<ConstructorParameters<typeof Device>[0]> = {}) =>
    new Device({
      id: 'device-1',
      serialNumber: 'UFLEX-DEV-001',
      macAddress: 'AA:BB:CC:DD:EE:FF',
      firmwareVersion: '1.2.0',
      batteryLevel: 87,
      model: 'UFlex Tracker Pro',
      advertisedName: 'UFLEX-DEV-001',
      calibrationStatus: 'VALID',
      status: 'AVAILABLE',
      lastSeenAt: new Date('2026-06-10T08:30:00Z'),
      clinicId: 'clinic-1',
      currentPatientId: 'patient-1',
      currentPatientFullName: 'Maria Lopez',
      offline: false,
      ...overrides,
    });

  it('exposes every field passed at construction time', () => {
    const device = buildDevice();

    expect(device.id).toBe('device-1');
    expect(device.serialNumber).toBe('UFLEX-DEV-001');
    expect(device.macAddress).toBe('AA:BB:CC:DD:EE:FF');
    expect(device.firmwareVersion).toBe('1.2.0');
    expect(device.batteryLevel).toBe(87);
    expect(device.model).toBe('UFlex Tracker Pro');
    expect(device.advertisedName).toBe('UFLEX-DEV-001');
    expect(device.calibrationStatus).toBe('VALID');
    expect(device.status).toBe('AVAILABLE');
    expect(device.lastSeenAt).toEqual(new Date('2026-06-10T08:30:00Z'));
    expect(device.clinicId).toBe('clinic-1');
    expect(device.currentPatientId).toBe('patient-1');
    expect(device.currentPatientFullName).toBe('Maria Lopez');
    expect(device.offline).toBe(false);
  });

  it('allows nullable optional relationships and timestamps', () => {
    const device = buildDevice({
      advertisedName: null,
      lastSeenAt: null,
      currentPatientId: null,
      currentPatientFullName: null,
    });

    expect(device.advertisedName).toBeNull();
    expect(device.lastSeenAt).toBeNull();
    expect(device.currentPatientId).toBeNull();
    expect(device.currentPatientFullName).toBeNull();
  });

  it('allows operational fields to be mutated through setters', () => {
    const device = buildDevice();

    device.batteryLevel = 42;
    device.status = 'IN_MAINTENANCE';
    device.calibrationStatus = 'NEEDS_CALIBRATION';
    device.offline = true;

    expect(device.batteryLevel).toBe(42);
    expect(device.status).toBe('IN_MAINTENANCE');
    expect(device.calibrationStatus).toBe('NEEDS_CALIBRATION');
    expect(device.offline).toBe(true);
  });
});
