/**
 * Command object for user sign-up operations in the domain layer of the IAM bounded context.
 * Carries the email, password and selected role(s) for registration.
 */
export class SignUpCommand {
  private _email: string;
  private _password: string;
  private _roles: string[];

  constructor(resource: { email: string; password: string; roles: string[] }) {
    this._email = resource.email;
    this._password = resource.password;
    this._roles = resource.roles;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }
}
