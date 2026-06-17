import {DiagnosticSession} from '../domain/model/diagnostics.types';

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
  logs: []
};