export type CalibrationAction = 'needs_calibration' | 'validate';

export interface CalibrationCommand {
  deviceId: string;
  action: CalibrationAction;
}
