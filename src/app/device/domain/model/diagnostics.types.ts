/**
 * Domain types for the System Diagnostics flow inside the Device
 * bounded context.
 */

export type DiagnosticScopeColor = 'info' | 'success' | 'warning' | 'error';
export type DiagnosticSeverity = 'success' | 'warning' | 'error';

export interface DiagnosticLogEntry {
  timestamp: string;
  scope: string;
  scopeColor?: DiagnosticScopeColor;
  message: string;
  /** Optional inline highlight rendered after the message. */
  highlight?: {text: string; severity: DiagnosticSeverity};
}

export interface DiagnosticPhase {
  id: string;
  label: string;
  active: boolean;
}

export interface DiagnosticMetric {
  id: 'battery' | 'signal' | 'temperature';
  icon: string;
  unit: string;
  primary: string;
  secondary: string;
}

export interface DiagnosticSession {
  hardwareId: string;
  hardwareIdBadge: string;
  scanProgressPct: number;
  estimatedRemainingLabel: string;
  phases: DiagnosticPhase[];
  metrics: {
    batteryHealthPct: number;
    batteryDetail: string;
    signalDbm: number;
    signalBars: number;
    signalDetail: string;
    operatingTempC: number;
    tempRangeLabel: string;
  };
  logs: DiagnosticLogEntry[];
}
