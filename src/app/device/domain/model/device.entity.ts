import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {CalibrationStatus, DeviceStatus} from './device.types';

/**
 * Device entity in the Device bounded context. Represents a uFlex IoT
 * rehabilitation kit assigned (or unassigned) to a patient.
 */
export class Device implements BaseEntity {
  private _id: number;
  private _kitId: string;
  private _linkedPatient: string | null;
  private _batteryLevel: number;
  private _bluetoothConnected: boolean;
  private _calibrationStatus: CalibrationStatus;
  private _firmwareVersion: string;
  private _status: DeviceStatus;

  constructor(data: {
    id: number;
    kitId: string;
    linkedPatient: string | null;
    batteryLevel: number;
    bluetoothConnected: boolean;
    calibrationStatus: CalibrationStatus;
    firmwareVersion: string;
    status: DeviceStatus;
  }) {
    this._id = data.id;
    this._kitId = data.kitId;
    this._linkedPatient = data.linkedPatient;
    this._batteryLevel = data.batteryLevel;
    this._bluetoothConnected = data.bluetoothConnected;
    this._calibrationStatus = data.calibrationStatus;
    this._firmwareVersion = data.firmwareVersion;
    this._status = data.status;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get kitId(): string { return this._kitId; }
  set kitId(value: string) { this._kitId = value; }

  get linkedPatient(): string | null { return this._linkedPatient; }
  set linkedPatient(value: string | null) { this._linkedPatient = value; }

  get batteryLevel(): number { return this._batteryLevel; }
  set batteryLevel(value: number) { this._batteryLevel = value; }

  get bluetoothConnected(): boolean { return this._bluetoothConnected; }
  set bluetoothConnected(value: boolean) { this._bluetoothConnected = value; }

  get calibrationStatus(): CalibrationStatus { return this._calibrationStatus; }
  set calibrationStatus(value: CalibrationStatus) { this._calibrationStatus = value; }

  get firmwareVersion(): string { return this._firmwareVersion; }
  set firmwareVersion(value: string) { this._firmwareVersion = value; }

  get status(): DeviceStatus { return this._status; }
  set status(value: DeviceStatus) { this._status = value; }
}
