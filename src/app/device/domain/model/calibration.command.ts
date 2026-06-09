export type CalibrationAction = 'needs_calibration' | 'validate';

export interface CalibrationCommand {
  serialNumber: string;
  action: CalibrationAction;
}