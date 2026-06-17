export class ConfirmHardwareReadinessCommand {
  private _deviceId: string;
  private _sensorsPlaced: boolean;

  constructor(resource: { deviceId: string; sensorsPlaced: boolean }) {
    this._deviceId = resource.deviceId;
    this._sensorsPlaced = resource.sensorsPlaced;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  set deviceId(value: string) {
    this._deviceId = value;
  }

  get sensorsPlaced(): boolean {
    return this._sensorsPlaced;
  }

  set sensorsPlaced(value: boolean) {
    this._sensorsPlaced = value;
  }
}
