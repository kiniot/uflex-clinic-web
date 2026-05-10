import { Device } from './device.entity';

describe('Device entity', () => {
  const buildDevice = (overrides: Partial<ConstructorParameters<typeof Device>[0]> = {}) =>
    new Device({
      id: 1,
      kitId: 'KIT-001',
      linkedPatient: 'Maria Lopez',
      batteryLevel: 87,
      bluetoothConnected: true,
      calibrationStatus: 'valid',
      firmwareVersion: '1.2.0',
      status: 'online',
      ...overrides
    });

  it('exposes every field passed at construction time', () => {
    const device = buildDevice();

    expect(device.id).toBe(1);
    expect(device.kitId).toBe('KIT-001');
    expect(device.linkedPatient).toBe('Maria Lopez');
    expect(device.batteryLevel).toBe(87);
    expect(device.bluetoothConnected).toBe(true);
    expect(device.calibrationStatus).toBe('valid');
    expect(device.firmwareVersion).toBe('1.2.0');
    expect(device.status).toBe('online');
  });

  it('allows the linked patient to be null when the kit is unassigned', () => {
    const device = buildDevice({ linkedPatient: null });

    expect(device.linkedPatient).toBeNull();
  });

  it('allows operational fields to be mutated through setters', () => {
    const device = buildDevice();

    device.batteryLevel = 42;
    device.status = 'offline';
    device.calibrationStatus = 'expired';

    expect(device.batteryLevel).toBe(42);
    expect(device.status).toBe('offline');
    expect(device.calibrationStatus).toBe('expired');
  });
});
