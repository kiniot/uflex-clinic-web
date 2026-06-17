import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ClinicAddressValue } from './clinic-address.value';

interface ClinicProfileProps {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: ClinicAddressValue;
}

export class ClinicProfile implements BaseEntity {
  private _id: string;
  private _legalName: string;
  private _commercialName: string;
  private _ruc: string;
  private _email: string;
  private _countryCode: string;
  private _phoneNumber: string;
  private _address: ClinicAddressValue;

  constructor(props: ClinicProfileProps) {
    this._id = props.id;
    this._legalName = props.legalName;
    this._commercialName = props.commercialName;
    this._ruc = props.ruc;
    this._email = props.email;
    this._countryCode = props.countryCode;
    this._phoneNumber = props.phoneNumber;
    this._address = props.address;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get legalName(): string { return this._legalName; }
  set legalName(value: string) { this._legalName = value; }

  get commercialName(): string { return this._commercialName; }
  set commercialName(value: string) { this._commercialName = value; }

  get ruc(): string { return this._ruc; }
  set ruc(value: string) { this._ruc = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get countryCode(): string { return this._countryCode; }
  set countryCode(value: string) { this._countryCode = value; }

  get phoneNumber(): string { return this._phoneNumber; }
  set phoneNumber(value: string) { this._phoneNumber = value; }

  get address(): ClinicAddressValue { return this._address; }
  set address(value: ClinicAddressValue) { this._address = value; }
}
