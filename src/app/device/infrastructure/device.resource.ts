import { BaseResource } from '../../shared/infrastructure/base-response';
import { CalibrationStatus, DeviceStatus } from '../domain/model/device.types';

export interface DeviceResource extends BaseResource {
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
