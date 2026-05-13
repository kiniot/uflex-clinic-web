import {computed, Injectable, signal} from '@angular/core';
import {Device} from '../domain/model/device.entity';
import {BatteryHealth, ConnectivityGateway, FleetConnectivity} from '../domain/model/fleet-snapshot';
import {InventoryDevice} from '../domain/model/inventory-device.entity';
import {MOCK_DEVICES} from '../infrastructure/device.mock';
import {MOCK_BATTERY_HEALTH, MOCK_CONNECTIVITY_GATEWAY, MOCK_FLEET_CONNECTIVITY} from '../infrastructure/fleet-snapshot.mock';
import {MOCK_INVENTORY_DEVICES, MOCK_INVENTORY_TOTAL} from '../infrastructure/inventory-device.mock';
import {DeviceStatus} from '../domain/model/device.types';

/**
 * Application-layer store for the Device bounded context. Exposes the
 * fleet to clinic-admin views (operational status), plus the
 * inventory + connectivity/battery snapshots consumed by the
 * physiotherapist's Device Inventory page.
 *
 * Hydrated from mocks today; once the Device API exists, the
 * constructor will subscribe to the real fleet endpoint.
 */
@Injectable({providedIn: 'root'})
export class DeviceStore {
  private readonly devicesSignal = signal<Device[]>(MOCK_DEVICES);
  private readonly inventorySignal = signal<InventoryDevice[]>(MOCK_INVENTORY_DEVICES);
  private readonly inventoryTotalSignal = signal<number>(MOCK_INVENTORY_TOTAL);
  private readonly connectivitySignal = signal<FleetConnectivity>(MOCK_FLEET_CONNECTIVITY);
  private readonly batteryHealthSignal = signal<BatteryHealth>(MOCK_BATTERY_HEALTH);
  private readonly gatewaySignal = signal<ConnectivityGateway>(MOCK_CONNECTIVITY_GATEWAY);

  readonly devices = this.devicesSignal.asReadonly();
  readonly inventoryDevices = this.inventorySignal.asReadonly();
  readonly inventoryTotal = this.inventoryTotalSignal.asReadonly();
  readonly fleetConnectivity = this.connectivitySignal.asReadonly();
  readonly batteryHealth = this.batteryHealthSignal.asReadonly();
  readonly connectivityGateway = this.gatewaySignal.asReadonly();

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

  readonly availableUnitsPct = computed(() => {
    const c = this.fleetConnectivity();
    if (c.totalUnits === 0) return 0;
    return Math.round((c.availableUnits / c.totalUnits) * 100);
  });

  updateDeviceStatus(id: number, status: DeviceStatus) {
    this.devicesSignal.update(devices =>
      devices.map(device => {
        if (device.id !== id) return device;
        return new Device({
          id: device.id,
          kitId: device.kitId,
          linkedPatient: device.linkedPatient,
          batteryLevel: device.batteryLevel,
          bluetoothConnected: device.bluetoothConnected,
          calibrationStatus: device.calibrationStatus,
          firmwareVersion: device.firmwareVersion,
          status
        });
      })
    );
  }
}
