import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {SpecializedRole, TeamMemberStatus} from './team-member.types';

/**
 * Team member entity in the Organization bounded context. Represents a
 * physiotherapist (or other staff role) attached to the clinic. Their
 * underlying user identity lives in IAM; here we model the org-side data.
 */
export class TeamMember implements BaseEntity {
  private _id: number;
  private _name: string;
  private _email: string;
  private _role: SpecializedRole;
  private _activePatients: number;
  private _status: TeamMemberStatus;
  private _avatarInitials: string;

  constructor(data: {
    id: number;
    name: string;
    email: string;
    role: SpecializedRole;
    activePatients: number;
    status: TeamMemberStatus;
    avatarInitials: string;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._email = data.email;
    this._role = data.role;
    this._activePatients = data.activePatients;
    this._status = data.status;
    this._avatarInitials = data.avatarInitials;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): SpecializedRole { return this._role; }
  set role(value: SpecializedRole) { this._role = value; }

  get activePatients(): number { return this._activePatients; }
  set activePatients(value: number) { this._activePatients = value; }

  get status(): TeamMemberStatus { return this._status; }
  set status(value: TeamMemberStatus) { this._status = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }
}
