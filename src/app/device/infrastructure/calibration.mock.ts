import {CalibrationSession} from '../domain/model/calibration.types';

/**
 * Stub calibration session shown in the calibration view while the
 * Device backend's real-time telemetry is not yet wired.
 */
export const MOCK_CALIBRATION_SESSION: CalibrationSession = {
  sensorName: 'uFlex FlexSense v4.2',
  sensorId: 'FX-99210',
  pitchDeg: 2.45,
  yawDeg: -0.12,
  rollDeg: 1.18,
  steps: [
    {
      id: 'level-surface',
      title: 'Level Surface Alignment',
      description: 'Device base detected at 0.04° variance. Confirmed.',
      status: 'completed'
    },
    {
      id: 'vertical-axis',
      title: 'Vertical Axis Check',
      description: 'Please rotate the device 90 degrees clockwise to match vertical plane.',
      status: 'active',
      progress: 55
    },
    {
      id: 'motion-test',
      title: 'Motion Test',
      description: 'Execute three rapid flexions to verify high-velocity sampling.',
      status: 'pending'
    }
  ],
  hardwareIntegrity: 'optimal',
  batteryHealthPct: 94,
  firmwareVersion: 'v4.2.1-Stable',
  connectionLatencyLabel: 'Ultra-Low Latency',
  lastSyncLabel: '2 minutes ago'
};
