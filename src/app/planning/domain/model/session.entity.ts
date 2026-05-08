import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {IotSessionStatus} from './session.types';

interface SessionProps {
  id: number;
  timeLabel: string;
  patientName: string;
  patientInitials: string;
  focusArea: string;
  iotStatus: IotSessionStatus;
}

/**
 * Scheduled clinical encounter between a physiotherapist and a patient.
 * Sessions own their time slot and the focus area being worked on; the
 * IoT status is the live link state of the patient's kit at the time
 * the schedule was rendered.
 */
export class Session implements BaseEntity {
  private _id: number;
  private _timeLabel: string;
  private _patientName: string;
  private _patientInitials: string;
  private _focusArea: string;
  private _iotStatus: IotSessionStatus;

  constructor(props: SessionProps) {
    this._id = props.id;
    this._timeLabel = props.timeLabel;
    this._patientName = props.patientName;
    this._patientInitials = props.patientInitials;
    this._focusArea = props.focusArea;
    this._iotStatus = props.iotStatus;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get timeLabel(): string { return this._timeLabel; }
  set timeLabel(value: string) { this._timeLabel = value; }

  get patientName(): string { return this._patientName; }
  set patientName(value: string) { this._patientName = value; }

  get patientInitials(): string { return this._patientInitials; }
  set patientInitials(value: string) { this._patientInitials = value; }

  get focusArea(): string { return this._focusArea; }
  set focusArea(value: string) { this._focusArea = value; }

  get iotStatus(): IotSessionStatus { return this._iotStatus; }
  set iotStatus(value: IotSessionStatus) { this._iotStatus = value; }
}
