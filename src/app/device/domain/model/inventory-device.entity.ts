import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {InventoryStatus} from './inventory-device.types';

interface InventoryDeviceProps {
  id: number;
  deviceId: string;
  modelName: string;
  status: InventoryStatus;
  batteryPct: number;
  lastSyncLabel: string;
  assignmentName: string | null;
}

/**
 * Read projection of a device for the physiotherapist's Device
 * Inventory view. Carries the columns the inventory table renders —
 * deviceId, model, status, battery, last sync, current assignment —
 * without the operational concerns (firmware, calibration windows)
 * that the clinic admin's fleet view needs.
 */
export class InventoryDevice implements BaseEntity {
  private _id: number;
  private _deviceId: string;
  private _modelName: string;
  private _status: InventoryStatus;
  private _batteryPct: number;
  private _lastSyncLabel: string;
  private _assignmentName: string | null;

  constructor(props: InventoryDeviceProps) {
    this._id = props.id;
    this._deviceId = props.deviceId;
    this._modelName = props.modelName;
    this._status = props.status;
    this._batteryPct = props.batteryPct;
    this._lastSyncLabel = props.lastSyncLabel;
    this._assignmentName = props.assignmentName;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get deviceId(): string { return this._deviceId; }
  set deviceId(value: string) { this._deviceId = value; }

  get modelName(): string { return this._modelName; }
  set modelName(value: string) { this._modelName = value; }

  get status(): InventoryStatus { return this._status; }
  set status(value: InventoryStatus) { this._status = value; }

  get batteryPct(): number { return this._batteryPct; }
  set batteryPct(value: number) { this._batteryPct = value; }

  get lastSyncLabel(): string { return this._lastSyncLabel; }
  set lastSyncLabel(value: string) { this._lastSyncLabel = value; }

  get assignmentName(): string | null { return this._assignmentName; }
  set assignmentName(value: string | null) { this._assignmentName = value; }
}
