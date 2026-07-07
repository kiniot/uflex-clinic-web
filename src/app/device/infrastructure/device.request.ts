import { DeviceStatus } from '../domain/model/device.types';

export interface UpdateDeviceStatusRequest {
  status: DeviceStatus;
}

export interface CalibrationActionRequest {
  action: 'needs_calibration' | 'validate';
}

export interface AssignDeviceToPatientRequest {
  patientId: string;
}

export interface UpdateTelemetryRequest {
  batteryLevel: number;
}
