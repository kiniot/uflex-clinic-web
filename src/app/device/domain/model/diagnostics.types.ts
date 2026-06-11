export interface DiagnosticLogEntry {
  timestamp: string;
  scope: string;
  message: string;
  highlight?: {text: string; severity: 'success' | 'warning' | 'error'};
  scopeColor?: string;
}

export interface DiagnosticPhase {
  id: string;
  label: string;
  active: boolean;
}

export interface DiagnosticMetrics {
  batteryHealthPct: number;
  batteryDetail: string;
  signalDbm: number;
  signalBars: number;
  signalDetail: string;
  operatingTempC: number;
  tempRangeLabel: string;
}

export interface DiagnosticSession {
  hardwareId: string;
  hardwareIdBadge: string;
  scanProgressPct: number;
  estimatedRemainingLabel: string;
  phases: DiagnosticPhase[];
  metrics: DiagnosticMetrics;
  logs: DiagnosticLogEntry[];
}