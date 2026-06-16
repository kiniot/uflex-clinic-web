export class CancelTherapySessionCommand {
  private _reason: string;

  constructor(resource: { reason: string }) {
    this._reason = resource.reason;
  }

  get reason(): string {
    return this._reason;
  }

  set reason(value: string) {
    this._reason = value;
  }
}
