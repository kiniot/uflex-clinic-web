import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Device } from '../domain/model/device.entity';
import { DeviceApiEndpoint } from '../infrastructure/device-endpoint';
import { UpdateDeviceStatusCommand } from '../domain/model/update-device-status.command';
import { CalibrationCommand } from '../domain/model/calibration.command';
import { AssignDeviceCommand } from '../domain/model/assign-device.command';
import { UpdateTelemetryCommand } from '../domain/model/update-telemetry.command';
import { DeviceStatusApiEndpoint } from '../infrastructure/device-status-endpoint';
import { DeviceCalibrationApiEndpoint } from '../infrastructure/device-calibration-endpoint';
import { DeviceAssignmentApiEndpoint } from '../infrastructure/device-assignment-endpoint';
import { DeviceTelemetryApiEndpoint } from '../infrastructure/device-telemetry-endpoint';
import { MyAssignedDeviceApiEndpoint } from '../infrastructure/my-assigned-device-endpoint';
import { FleetMetricsApiEndpoint } from '../infrastructure/fleet-metrics-endpoint';
import { FleetMetrics } from '../domain/model/fleet-metrics';
import { DeviceStatus } from '../domain/model/device.types';

@Injectable({ providedIn: 'root' })
export class DeviceStore {
  private readonly http = inject(HttpClient);
  private readonly deviceApi = new DeviceApiEndpoint(this.http);
  private readonly deviceStatusApi = new DeviceStatusApiEndpoint(this.http);
  private readonly deviceCalibrationApi = new DeviceCalibrationApiEndpoint(this.http);
  private readonly deviceAssignmentApi = new DeviceAssignmentApiEndpoint(this.http);
  private readonly deviceTelemetryApi = new DeviceTelemetryApiEndpoint(this.http);
  private readonly myAssignedDeviceApi = new MyAssignedDeviceApiEndpoint(this.http);
  private readonly fleetMetricsApi = new FleetMetricsApiEndpoint(this.http);

  private readonly devicesSignal = signal<Device[]>([]);
  private readonly fleetMetricsSignal = signal<FleetMetrics>({
    total: 0,
    available: 0,
    assigned: 0,
    inMaintenance: 0,
    lowBattery: 0,
    offline: 0,
    requestedKits: 0,
    pendingKits: 0,
  });
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly myAssignedDeviceSignal = signal<Device | null>(null);

  readonly devices = this.devicesSignal.asReadonly();
  readonly fleetMetrics = this.fleetMetricsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly myAssignedDevice = this.myAssignedDeviceSignal.asReadonly();

  constructor() {
    this.loadDevices();
    this.loadFleetMetricsFromServer();
  }

  readonly totalActiveKits = computed(
    () => this.devices().filter((d) => d.status !== 'RETIRED').length,
  );

  readonly syncedThisWeek = computed(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.devices().filter((d) => d.lastSeenAt && d.lastSeenAt >= weekAgo).length;
  });

  readonly requiresCalibration = computed(
    () => this.devices().filter((d) => d.calibrationStatus === 'NEEDS_CALIBRATION').length,
  );

  readonly onlinePercentage = computed(() => {
    const total = this.devices().length;
    if (total === 0) return 0;
    const online = this.devices().filter((d) => !d.offline).length;
    return Math.round((online / total) * 100);
  });

  readonly availableUnitsPct = computed(() => {
    const m = this.fleetMetrics();
    if (m.total === 0) return 0;
    return Math.round((m.available / m.total) * 100);
  });

  loadDevices(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.deviceApi.getAll().subscribe({
      next: (devices) => {
        this.devicesSignal.set(devices);
        this.recomputeFleetMetrics();
        this.isLoadingSignal.set(false);
      },
      error: (err: Error) => {
        this.errorSignal.set(err.message);
        this.isLoadingSignal.set(false);
      },
    });
  }

  updateDeviceStatus(deviceId: string, status: DeviceStatus): Observable<Device> {
    const command: UpdateDeviceStatusCommand = { deviceId, status };
    return this.deviceStatusApi.updateStatus(command).pipe(
      tap((updatedDevice) => {
        this.replaceDeviceInState(updatedDevice);
        this.recomputeFleetMetrics();
      }),
      catchError((err: Error) => {
        this.errorSignal.set(err.message);
        throw err;
      }),
    );
  }

  calibrateDevice(deviceId: string, action: 'needs_calibration' | 'validate'): Observable<Device> {
    const command: CalibrationCommand = { deviceId, action };
    return this.deviceCalibrationApi.execute(command).pipe(
      tap((updatedDevice) => {
        this.replaceDeviceInState(updatedDevice);
        this.recomputeFleetMetrics();
      }),
      catchError((err: Error) => {
        this.errorSignal.set(err.message);
        throw err;
      }),
    );
  }

  assignDevice(deviceId: string, patientId: string): Observable<Device> {
    const command: AssignDeviceCommand = { deviceId, patientId };
    return this.deviceAssignmentApi.assign(command).pipe(
      tap((updatedDevice) => {
        this.replaceDeviceInState(updatedDevice);
        this.recomputeFleetMetrics();
      }),
      catchError((err: Error) => {
        this.errorSignal.set(err.message);
        throw err;
      }),
    );
  }

  unassignDevice(deviceId: string): Observable<void> {
    return this.deviceAssignmentApi.unassign(deviceId).pipe(
      tap(() => {
        this.devicesSignal.update((devices) =>
          devices.map((d) => {
            if (d.id !== deviceId) return d;
            return new Device({
              id: d.id,
              serialNumber: d.serialNumber,
              macAddress: d.macAddress,
              firmwareVersion: d.firmwareVersion,
              batteryLevel: d.batteryLevel,
              model: d.model,
              advertisedName: d.advertisedName,
              calibrationStatus: d.calibrationStatus,
              status: 'AVAILABLE',
              lastSeenAt: d.lastSeenAt,
              clinicId: d.clinicId,
              currentPatientId: null,
              currentPatientFullName: null,
              offline: d.offline,
            });
          }),
        );
        this.recomputeFleetMetrics();
      }),
      catchError((err: Error) => {
        this.errorSignal.set(err.message);
        throw err;
      }),
    );
  }

  updateTelemetry(deviceId: string, batteryLevel: number): Observable<void> {
    const command: UpdateTelemetryCommand = { deviceId, batteryLevel };
    return this.deviceTelemetryApi.update(command).pipe(
      tap(() => {
        this.devicesSignal.update((devices) =>
          devices.map((d) => {
            if (d.id !== deviceId) return d;
            return new Device({
              id: d.id,
              serialNumber: d.serialNumber,
              macAddress: d.macAddress,
              firmwareVersion: d.firmwareVersion,
              batteryLevel: batteryLevel,
              model: d.model,
              advertisedName: d.advertisedName,
              calibrationStatus: d.calibrationStatus,
              status: d.status,
              lastSeenAt: new Date(),
              clinicId: d.clinicId,
              currentPatientId: d.currentPatientId,
              currentPatientFullName: d.currentPatientFullName,
              offline: d.offline,
            });
          }),
        );
        this.recomputeFleetMetrics();
      }),
      catchError((err: Error) => {
        this.errorSignal.set(err.message);
        throw err;
      }),
    );
  }

  loadFleetMetricsFromServer(): void {
    this.fleetMetricsApi.getMetrics().subscribe({
      next: (metrics) => {
        this.fleetMetricsSignal.set(metrics);
      },
      error: () => {
        this.recomputeFleetMetrics();
      },
    });
  }

  loadMyAssignedDevice(): void {
    this.isLoadingSignal.set(true);
    this.myAssignedDeviceApi.getMyAssigned().subscribe({
      next: (device) => {
        this.myAssignedDeviceSignal.set(device);
        this.isLoadingSignal.set(false);
      },
      error: () => {
        this.myAssignedDeviceSignal.set(null);
        this.isLoadingSignal.set(false);
      },
    });
  }

  private recomputeFleetMetrics(): void {
    const devices = this.devices();
    // requestedKits/pendingKits are derived server-side from the subscription, so we
    // preserve the last server-provided values when recomputing locally.
    const prev = this.fleetMetricsSignal();
    const metrics: FleetMetrics = {
      total: devices.length,
      available: devices.filter((d) => d.status === 'AVAILABLE').length,
      assigned: devices.filter((d) => d.status === 'ASSIGNED').length,
      inMaintenance: devices.filter((d) => d.status === 'IN_MAINTENANCE').length,
      lowBattery: devices.filter((d) => d.batteryLevel < 20).length,
      offline: devices.filter((d) => d.offline).length,
      requestedKits: prev.requestedKits,
      pendingKits: prev.pendingKits,
    };
    this.fleetMetricsSignal.set(metrics);
  }

  private replaceDeviceInState(updatedDevice: Device): void {
    this.devicesSignal.update((devices) =>
      devices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)),
    );
  }
}
