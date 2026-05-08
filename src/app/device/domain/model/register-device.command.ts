/**
 * Command capturing the user's intent to register a new uFlex hub in the
 * Device fleet. The presentation layer fills it from the registration
 * form; the application layer hands it to the Device API endpoint.
 */
export class RegisterDeviceCommand {
  private _kitSerialNumber: string;
  private _batchId: string;
  private _hardwareVersion: string;
  private _firmwareVersion: string;

  constructor(data: {
    kitSerialNumber: string;
    batchId: string;
    hardwareVersion: string;
    firmwareVersion: string;
  }) {
    this._kitSerialNumber = data.kitSerialNumber;
    this._batchId = data.batchId;
    this._hardwareVersion = data.hardwareVersion;
    this._firmwareVersion = data.firmwareVersion;
  }

  get kitSerialNumber(): string { return this._kitSerialNumber; }
  get batchId(): string { return this._batchId; }
  get hardwareVersion(): string { return this._hardwareVersion; }
  get firmwareVersion(): string { return this._firmwareVersion; }
}
