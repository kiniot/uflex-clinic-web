import {CalibrationStep, CalibrationSession} from '../domain/model/calibration.types';

export const CALIBRATION_STEPS: CalibrationStep[] = [
  {id: 'init', label: 'Initialize', title: 'Initialize', description: 'Initializing device', status: 'pending', progress: null},
  {id: 'validate', label: 'Validate', title: 'Validate', description: 'Validating hardware', status: 'pending', progress: null},
  {id: 'calibrate', label: 'Calibrate', title: 'Calibrate', description: 'Calibrating sensors', status: 'pending', progress: null},
  {id: 'finalize', label: 'Finalize', title: 'Finalize', description: 'Finalizing report', status: 'pending', progress: null},
];

export const MOCK_CALIBRATION_SESSION: CalibrationSession = {
  sensorName: 'UFlex Tracker Pro',
  sensorId: 'UF-2024-K82',
  progressPct: 0,
  currentPhase: 'ready',
  phases: [
    {id: 'init', label: 'Initializing', active: false},
    {id: 'validate', label: 'Validating Hardware', active: false},
    {id: 'calibrate', label: 'Calibrating Sensors', active: false},
    {id: 'finalize', label: 'Finalizing Report', active: false}
  ],
  steps: CALIBRATION_STEPS,
  batteryLevel: 100,
  signalStrength: 4,
  pitchDeg: 0,
  rollDeg: 0,
  yawDeg: 0,
  batteryHealthPct: 100,
  firmwareVersion: 'v1.0.0',
  connectionLatencyLabel: '12ms',
  lastSyncLabel: 'Just now',
  hardwareIntegrity: 'operational'
};