export class InitiateTherapyPreparationCommand {
  private _patientId: string;
  private _treatmentPlanId: string;
  private _iotDeviceId: string;
  private _routineId: string;

  constructor(resource: {
    patientId: string;
    treatmentPlanId: string;
    iotDeviceId: string;
    routineId: string;
  }) {
    this._patientId = resource.patientId;
    this._treatmentPlanId = resource.treatmentPlanId;
    this._iotDeviceId = resource.iotDeviceId;
    this._routineId = resource.routineId;
  }

  get patientId(): string {
    return this._patientId;
  }

  set patientId(value: string) {
    this._patientId = value;
  }

  get treatmentPlanId(): string {
    return this._treatmentPlanId;
  }

  set treatmentPlanId(value: string) {
    this._treatmentPlanId = value;
  }

  get iotDeviceId(): string {
    return this._iotDeviceId;
  }

  set iotDeviceId(value: string) {
    this._iotDeviceId = value;
  }

  get routineId(): string {
    return this._routineId;
  }

  set routineId(value: string) {
    this._routineId = value;
  }
}
