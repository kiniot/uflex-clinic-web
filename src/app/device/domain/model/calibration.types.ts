export interface CalibrationStep {
  id: string;
  label: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  progress: number | null;
}

export type CalibrationPhase = 'init' | 'validate' | 'calibrate' | 'finalize';

export interface CalibrationSession {
  sensorName: string;
  sensorId: string;
  progressPct: number;
  currentPhase: string;
  phases: {id: string; label: string; active: boolean}[];
  steps: CalibrationStep[];
  batteryLevel: number;
  signalStrength: number;
  pitchDeg: number;
  rollDeg: number;
  yawDeg: number;
  batteryHealthPct: number;
  firmwareVersion: string;
  connectionLatencyLabel: string;
  lastSyncLabel: string;
  hardwareIntegrity: 'operational' | 'warning' | 'critical';
}

export type CalibrationStatus = 'VALID' | 'NEEDS_CALIBRATION';

export type HardwareIntegrityLevel = 'operational' | 'warning' | 'critical';