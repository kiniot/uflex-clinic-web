export interface RegisterDeviceRequest {
  serialNumber: string;
  macAddress: string;
  firmwareVersion?: string;
  model?: string;
}

export interface UpdateDeviceStatusRequest {
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED';
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