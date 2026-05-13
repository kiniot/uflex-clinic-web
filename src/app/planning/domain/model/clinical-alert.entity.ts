import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {AlertAction, AlertSeverity} from './clinical-alert.types';

interface ClinicalAlertProps {
  id: number;
  patientName: string;
  agoLabel: string;
  message: string;
  severity: AlertSeverity;
  actions: AlertAction[];
}

/**
 * Clinical alert shown in the physiotherapist dashboard. Each alert is a
 * patient-care signal (out-of-range biomechanics, dropped compliance,
 * device malfunction) with one or more triage actions.
 */
export class ClinicalAlert implements BaseEntity {
  private _id: number;
  private _patientName: string;
  private _agoLabel: string;
  private _message: string;
  private _severity: AlertSeverity;
  private _actions: AlertAction[];

  constructor(props: ClinicalAlertProps) {
    this._id = props.id;
    this._patientName = props.patientName;
    this._agoLabel = props.agoLabel;
    this._message = props.message;
    this._severity = props.severity;
    this._actions = props.actions;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get patientName(): string { return this._patientName; }
  set patientName(value: string) { this._patientName = value; }

  get agoLabel(): string { return this._agoLabel; }
  set agoLabel(value: string) { this._agoLabel = value; }

  get message(): string { return this._message; }
  set message(value: string) { this._message = value; }

  get severity(): AlertSeverity { return this._severity; }
  set severity(value: AlertSeverity) { this._severity = value; }

  get actions(): AlertAction[] { return this._actions; }
  set actions(value: AlertAction[]) { this._actions = value; }
}
