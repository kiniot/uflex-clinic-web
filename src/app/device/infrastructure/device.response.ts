import { DeviceStatus, CalibrationStatus } from '../domain/model/device.types';

export interface DeviceResponse {
  id: string;
  serialNumber: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number;
  model: string;
  advertisedName: string | null;
  calibrationStatus: CalibrationStatus;
  status: DeviceStatus;
  lastSeenAt: string | null;
  clinicId: string;
  currentPatientId: string | null;
  currentPatientFullName: string | null;
  offline: boolean;
}

export interface ClinicFleetMetricsResponse {
  total: number;
  available: number;
  assigned: number;
  inMaintenance: number;
  lowBattery: number;
  offline: number;
}
