/**
 * Command object for user sign-up operations in the domain layer of the IAM bounded context.
 * Carries the email and password for registration.
 */
export class SignUpCommand {
  private _email: string;
  private _password: string;

  constructor(resource: { email: string; password: string }) {
    this._email = resource.email;
    this._password = resource.password;
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
}
