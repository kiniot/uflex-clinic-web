import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CalibrationStatus, DeviceStatus } from './device.types';

export class Device implements BaseEntity {
  private _id: string;
  private _serialNumber: string;
  private _macAddress: string;
  private _firmwareVersion: string;
  private _batteryLevel: number;
  private _model: string;
  private _advertisedName: string | null;
  private _calibrationStatus: CalibrationStatus;
  private _status: DeviceStatus;
  private _lastSeenAt: Date | null;
  private _clinicId: string;
  private _currentPatientId: string | null;
  private _currentPatientFullName: string | null;
  private _offline: boolean;

  constructor(data: {
    id: string;
    serialNumber: string;
    macAddress: string;
    firmwareVersion: string;
    batteryLevel: number;
    model: string;
    advertisedName: string | null;
    calibrationStatus: CalibrationStatus;
    status: DeviceStatus;
    lastSeenAt: Date | null;
    clinicId: string;
    currentPatientId: string | null;
    currentPatientFullName: string | null;
    offline: boolean;
  }) {
    this._id = data.id;
    this._serialNumber = data.serialNumber;
    this._macAddress = data.macAddress;
    this._firmwareVersion = data.firmwareVersion;
    this._batteryLevel = data.batteryLevel;
    this._model = data.model;
    this._advertisedName = data.advertisedName;
    this._calibrationStatus = data.calibrationStatus;
    this._status = data.status;
    this._lastSeenAt = data.lastSeenAt;
    this._clinicId = data.clinicId;
    this._currentPatientId = data.currentPatientId;
    this._currentPatientFullName = data.currentPatientFullName;
    this._offline = data.offline;
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get serialNumber(): string {
    return this._serialNumber;
  }
  set serialNumber(value: string) {
    this._serialNumber = value;
  }

  get macAddress(): string {
    return this._macAddress;
  }
  set macAddress(value: string) {
    this._macAddress = value;
  }

  get firmwareVersion(): string {
    return this._firmwareVersion;
  }
  set firmwareVersion(value: string) {
    this._firmwareVersion = value;
  }

  get batteryLevel(): number {
    return this._batteryLevel;
  }
  set batteryLevel(value: number) {
    this._batteryLevel = value;
  }

  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  get advertisedName(): string | null {
    return this._advertisedName;
  }
  set advertisedName(value: string | null) {
    this._advertisedName = value;
  }

  get calibrationStatus(): CalibrationStatus {
    return this._calibrationStatus;
  }
  set calibrationStatus(value: CalibrationStatus) {
    this._calibrationStatus = value;
  }

  get status(): DeviceStatus {
    return this._status;
  }
  set status(value: DeviceStatus) {
    this._status = value;
  }

  get lastSeenAt(): Date | null {
    return this._lastSeenAt;
  }
  set lastSeenAt(value: Date | null) {
    this._lastSeenAt = value;
  }

  get clinicId(): string {
    return this._clinicId;
  }
  set clinicId(value: string) {
    this._clinicId = value;
  }

  get currentPatientId(): string | null {
    return this._currentPatientId;
  }
  set currentPatientId(value: string | null) {
    this._currentPatientId = value;
  }

  get currentPatientFullName(): string | null {
    return this._currentPatientFullName;
  }
  set currentPatientFullName(value: string | null) {
    this._currentPatientFullName = value;
  }

  get offline(): boolean {
    return this._offline;
  }
  set offline(value: boolean) {
    this._offline = value;
  }
}
