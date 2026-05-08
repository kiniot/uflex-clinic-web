/**
 * Command capturing the user's intent to link a uFlex hub to a patient
 * profile. Produced by the link-patient view, consumed by the Device
 * application layer (and eventually the Device API endpoint).
 */
export class LinkPatientCommand {
  private _patientId: number;
  private _deviceId: number;
  private _protocolDuration: string;

  constructor(data: {
    patientId: number;
    deviceId: number;
    protocolDuration: string;
  }) {
    this._patientId = data.patientId;
    this._deviceId = data.deviceId;
    this._protocolDuration = data.protocolDuration;
  }

  get patientId(): number { return this._patientId; }
  get deviceId(): number { return this._deviceId; }
  get protocolDuration(): string { return this._protocolDuration; }
}
