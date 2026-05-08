import {computed, Injectable, signal} from '@angular/core';
import {Device} from '../domain/model/device.entity';
import {MOCK_DEVICES} from '../infrastructure/device.mock';

/**
 * Application-layer store for the Device bounded context. Exposes the fleet
 * as a signal plus the aggregate stats consumed by the Device Inventory
 * page (active kits, calibration alerts, network online ratio).
 *
 * Hydrated from a mock today; once the Device API exists, the constructor
 * will subscribe to the real fleet endpoint.
 */
@Injectable({providedIn: 'root'})
export class DeviceStore {
  private readonly devicesSignal = signal<Device[]>(MOCK_DEVICES);

  readonly devices = this.devicesSignal.asReadonly();

  readonly totalActiveKits = computed(() =>
    this.devices().filter(d => d.status !== 'offline').length
  );

  readonly requiresCalibration = computed(() =>
    this.devices().filter(d => d.calibrationStatus === 'expired').length
  );

  readonly onlinePercentage = computed(() => {
    const total = this.devices().length;
    if (total === 0) return 0;
    const online = this.devices().filter(d => d.status === 'online').length;
    return Math.round((online / total) * 100);
  });
}
