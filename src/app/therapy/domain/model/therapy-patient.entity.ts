import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {IotPatientStatus} from './therapy-patient.types';

interface TherapyPatientProps {
  id: number;
  name: string;
  mrn: string;
  avatarInitials: string;
  injuryContext: string;
  injuryIcon: string;
  lastSessionDateLabel: string;
  lastSessionTimeLabel: string;
  iotStatus: IotPatientStatus;
}

/**
 * Patient as seen from the Therapy context — a read projection focused
 * on what a clinician needs while reviewing therapy: identity, the
 * injury they're rehabilitating, and the recency/status of their last
 * IoT-tracked session. Distinct from Planning's broader Patient entity.
 */
export class TherapyPatient implements BaseEntity {
  private _id: number;
  private _name: string;
  private _mrn: string;
  private _avatarInitials: string;
  private _injuryContext: string;
  private _injuryIcon: string;
  private _lastSessionDateLabel: string;
  private _lastSessionTimeLabel: string;
  private _iotStatus: IotPatientStatus;

  constructor(props: TherapyPatientProps) {
    this._id = props.id;
    this._name = props.name;
    this._mrn = props.mrn;
    this._avatarInitials = props.avatarInitials;
    this._injuryContext = props.injuryContext;
    this._injuryIcon = props.injuryIcon;
    this._lastSessionDateLabel = props.lastSessionDateLabel;
    this._lastSessionTimeLabel = props.lastSessionTimeLabel;
    this._iotStatus = props.iotStatus;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get mrn(): string { return this._mrn; }
  set mrn(value: string) { this._mrn = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }

  get injuryContext(): string { return this._injuryContext; }
  set injuryContext(value: string) { this._injuryContext = value; }

  get injuryIcon(): string { return this._injuryIcon; }
  set injuryIcon(value: string) { this._injuryIcon = value; }

  get lastSessionDateLabel(): string { return this._lastSessionDateLabel; }
  set lastSessionDateLabel(value: string) { this._lastSessionDateLabel = value; }

  get lastSessionTimeLabel(): string { return this._lastSessionTimeLabel; }
  set lastSessionTimeLabel(value: string) { this._lastSessionTimeLabel = value; }

  get iotStatus(): IotPatientStatus { return this._iotStatus; }
  set iotStatus(value: IotPatientStatus) { this._iotStatus = value; }
}
