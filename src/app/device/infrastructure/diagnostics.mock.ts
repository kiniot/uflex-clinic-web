import {DiagnosticSession} from '../domain/model/diagnostics.types';

/**
 * In-memory diagnostic session shown while the live diagnostics channel
 * is not yet wired. Replace with a streamed telemetry source once the
 * Device backend exposes one.
 */
export const MOCK_DIAGNOSTIC_SESSION: DiagnosticSession = {
  hardwareId: 'UF-K10-BETA-2940-001',
  hardwareIdBadge: 'ADMIN',
  scanProgressPct: 72,
  estimatedRemainingLabel: 'Estimated 14s remaining',
  phases: [
    {id: 'init', label: 'Initializing', active: false},
    {id: 'validate', label: 'Validating Hardware', active: false},
    {id: 'calibrate', label: 'Calibrating Sensors', active: true},
    {id: 'finalize', label: 'Finalizing Report', active: false}
  ],
  metrics: {
    batteryHealthPct: 88,
    batteryDetail: 'Cycles: 412 | Status: Excellent',
    signalDbm: -42,
    signalBars: 4,
    signalDetail: 'Latency: 12ms | LE Mode: Enabled',
    operatingTempC: 31.4,
    tempRangeLabel: 'Stable range (20°C - 45°C)'
  },
  logs: [
    {
      timestamp: '08:42:01',
      scope: 'SYSTEM',
      message: 'Initializing uFlex Kernel v4.2.0-stable...'
    },
    {
      timestamp: '08:42:02',
      scope: 'BOOT',
      message: 'Primary flash memory OK (512MB partition mounted)'
    },
    {
      timestamp: '08:42:03',
      scope: 'IOT',
      message: 'Starting Bluetooth Low Energy stack...',
      highlight: {text: 'SUCCESS', severity: 'success'}
    },
    {
      timestamp: '08:42:04',
      scope: 'HW',
      message: 'Loading sensor drivers [accel, gyro, pressure, temp]'
    },
    {
      timestamp: '08:42:04',
      scope: 'NET',
      message: 'Pinging secure clinical endpoint: https://api.uflex.io...',
      highlight: {text: 'OK (18ms)', severity: 'success'}
    },
    {
      timestamp: '08:42:05',
      scope: 'AUTH',
      message: 'Admin session validated for user: UF-ADMIN-772'
    },
    {
      timestamp: '08:42:06',
      scope: 'SCAN',
      message: 'Starting comprehensive hardware scan (Level 3 Deep Scan)'
    },
    {
      timestamp: '08:42:07',
      scope: 'DIAG',
      message: 'Check pressure plate node 0x01:',
      highlight: {text: 'OPERATIONAL', severity: 'success'}
    },
    {
      timestamp: '08:42:08',
      scope: 'DIAG',
      message: 'Check pressure plate node 0x02:',
      highlight: {text: 'OPERATIONAL', severity: 'success'}
    },
    {
      timestamp: '08:42:09',
      scope: 'DIAG',
      scopeColor: 'warning',
      message: 'Check pressure plate node 0x03:',
      highlight: {text: 'WARNING (High Drift)', severity: 'warning'}
    }
  ]
};
