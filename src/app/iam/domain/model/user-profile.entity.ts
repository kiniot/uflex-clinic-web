import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {AccountStatus, UserRole, VerificationStatus} from './profile.types';

interface UserProfileProps {
  id: number;
  fullName: string;
  email: string;
  avatarInitials: string;
  role: UserRole;
  status: AccountStatus;
  verification: VerificationStatus;
  lastLoginLabel: string;
}

/**
 * Represents a managed user inside the IAM bounded context. Distinct from
 * the auth-session User: this entity is what an admin sees in the Profile
 * directory (role, account status, verification, last login).
 */
export class UserProfile implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _email: string;
  private _avatarInitials: string;
  private _role: UserRole;
  private _status: AccountStatus;
  private _verification: VerificationStatus;
  private _lastLoginLabel: string;

  constructor(props: UserProfileProps) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._avatarInitials = props.avatarInitials;
    this._role = props.role;
    this._status = props.status;
    this._verification = props.verification;
    this._lastLoginLabel = props.lastLoginLabel;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }

  get role(): UserRole { return this._role; }
  set role(value: UserRole) { this._role = value; }

  get status(): AccountStatus { return this._status; }
  set status(value: AccountStatus) { this._status = value; }

  get verification(): VerificationStatus { return this._verification; }
  set verification(value: VerificationStatus) { this._verification = value; }

  get lastLoginLabel(): string { return this._lastLoginLabel; }
  set lastLoginLabel(value: string) { this._lastLoginLabel = value; }
}
