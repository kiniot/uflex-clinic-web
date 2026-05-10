import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a user entity in the domain layer of the IAM bounded context.
 * Mirrors the backend `UserResource(id, email, roles)`.
 */
export class User implements BaseEntity {
  private _id: string;
  private _email: string;
  private _roles: string[];

  constructor(user: { id: string; email: string; roles?: string[] }) {
    this._id = user.id;
    this._email = user.email;
    this._roles = user.roles ?? [];
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }
}
