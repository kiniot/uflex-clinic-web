import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Clinic implements BaseEntity {
  private _id: string;
  private _name: string;
  private _addressLine: string;
  private _phone: string;
  private _totalPatients: number;
  private _patientsTrendPct: number;
  private _activePhysiotherapists: number;
  private _physiotherapistsOnLeave: number;
  private _availableIotKits: number;
  private _totalIotKits: number;

  constructor(data: {
    id: string;
    name: string;
    addressLine: string;
    phone: string;
    totalPatients: number;
    patientsTrendPct: number;
    activePhysiotherapists: number;
    physiotherapistsOnLeave: number;
    availableIotKits: number;
    totalIotKits: number;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._addressLine = data.addressLine;
    this._phone = data.phone;
    this._totalPatients = data.totalPatients;
    this._patientsTrendPct = data.patientsTrendPct;
    this._activePhysiotherapists = data.activePhysiotherapists;
    this._physiotherapistsOnLeave = data.physiotherapistsOnLeave;
    this._availableIotKits = data.availableIotKits;
    this._totalIotKits = data.totalIotKits;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get addressLine(): string { return this._addressLine; }
  set addressLine(value: string) { this._addressLine = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get totalPatients(): number { return this._totalPatients; }
  set totalPatients(value: number) { this._totalPatients = value; }

  get patientsTrendPct(): number { return this._patientsTrendPct; }
  set patientsTrendPct(value: number) { this._patientsTrendPct = value; }

  get activePhysiotherapists(): number { return this._activePhysiotherapists; }
  set activePhysiotherapists(value: number) { this._activePhysiotherapists = value; }

  get physiotherapistsOnLeave(): number { return this._physiotherapistsOnLeave; }
  set physiotherapistsOnLeave(value: number) { this._physiotherapistsOnLeave = value; }

  get availableIotKits(): number { return this._availableIotKits; }
  set availableIotKits(value: number) { this._availableIotKits = value; }

  get totalIotKits(): number { return this._totalIotKits; }
  set totalIotKits(value: number) { this._totalIotKits = value; }
}