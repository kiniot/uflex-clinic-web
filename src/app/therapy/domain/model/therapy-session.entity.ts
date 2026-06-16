import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { TherapySessionStatus } from './therapy-session.types';

export class TherapySession implements BaseEntity {
  private _id: string;
  private _patientId: string;
  private _treatmentPlanId: string;
  private _iotDeviceId: string;
  private _status: TherapySessionStatus | null;
  private _painLevel: number | null;
  private _requiresClinicalReview: boolean | null;
  private _startedAt: string | null;
  private _finalizedAt: string | null;

  constructor(data: {
    id: string;
    patientId: string;
    treatmentPlanId: string;
    iotDeviceId: string;
    status?: TherapySessionStatus | null;
    painLevel?: number | null;
    requiresClinicalReview?: boolean | null;
    startedAt?: string | null;
    finalizedAt?: string | null;
  }) {
    this._id = data.id;
    this._patientId = data.patientId;
    this._treatmentPlanId = data.treatmentPlanId;
    this._iotDeviceId = data.iotDeviceId;
    this._status = data.status ?? null;
    this._painLevel = data.painLevel ?? null;
    this._requiresClinicalReview = data.requiresClinicalReview ?? null;
    this._startedAt = data.startedAt ?? null;
    this._finalizedAt = data.finalizedAt ?? null;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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

  get status(): TherapySessionStatus | null {
    return this._status;
  }

  set status(value: TherapySessionStatus | null) {
    this._status = value;
  }

  get painLevel(): number | null {
    return this._painLevel;
  }

  set painLevel(value: number | null) {
    this._painLevel = value;
  }

  get requiresClinicalReview(): boolean | null {
    return this._requiresClinicalReview;
  }

  set requiresClinicalReview(value: boolean | null) {
    this._requiresClinicalReview = value;
  }

  get startedAt(): string | null {
    return this._startedAt;
  }

  set startedAt(value: string | null) {
    this._startedAt = value;
  }

  get finalizedAt(): string | null {
    return this._finalizedAt;
  }

  set finalizedAt(value: string | null) {
    this._finalizedAt = value;
  }
}
