import {BaseResource} from '../../shared/infrastructure/base-response';

export interface DeviceResource extends BaseResource {
  serialNumber: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number;
  model: string;
  calibrationStatus: 'VALID' | 'NEEDS_CALIBRATION';
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED';
  lastSyncAt: string | null;
  clinicId: string;
  currentPatientId: string | null;
  currentPatientFullName: string | null;
  offline: boolean;
}