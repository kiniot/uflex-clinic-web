/**
 * Calibration domain types for the Device bounded context.
 */

export type CalibrationStepStatus = 'completed' | 'active' | 'pending';

export interface CalibrationStep {
  id: string;
  title: string;
  description: string;
  status: CalibrationStepStatus;
  /** 0-100, only meaningful when status === 'active'. */
  progress?: number;
}

export interface AxisReading {
  axis: 'x' | 'y' | 'z';
  label: string;
  valueDeg: number;
}

export type HardwareIntegrityLevel = 'optimal' | 'warning' | 'degraded';

export interface CalibrationSession {
  sensorName: string;
  sensorId: string;
  pitchDeg: number;
  yawDeg: number;
  rollDeg: number;
  steps: CalibrationStep[];
  hardwareIntegrity: HardwareIntegrityLevel;
  batteryHealthPct: number;
  firmwareVersion: string;
  connectionLatencyLabel: string;
  lastSyncLabel: string;
}
