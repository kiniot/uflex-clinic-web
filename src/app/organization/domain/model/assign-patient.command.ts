export class AssignPatientCommand {
  private _physiotherapistId: string | null;

  constructor(resource: { physiotherapistId: string | null }) {
    this._physiotherapistId = resource.physiotherapistId;
  }

  get physiotherapistId(): string | null {
    return this._physiotherapistId;
  }

  set physiotherapistId(value: string | null) {
    this._physiotherapistId = value;
  }
}
