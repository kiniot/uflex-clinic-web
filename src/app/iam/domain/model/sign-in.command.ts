/**
 * Command object for user sign-in operations in the domain layer of the IAM bounded context.
 * Contains the username and password for authentication.
 */
export class SignInCommand {
  private _username: string;
  private _password: string;

  /**
   * Creates a new SignInCommand instance.
   * @param resource An object containing username and password.
   */
  constructor(resource: {username: string, password: string}) {
    this._username = resource.username;
    this._password = resource.password;
  }

  /**
   * Gets the username for sign-in.
   * @returns The username.
   */
  get username(): string {
    return this._username;
  }

  /**
   * Sets the username for sign-in.
   * @param value The username.
   */
  set username(value: string) {
    this._username = value;
  }

  /**
   * Gets the password for sign-in.
   * @returns The password.
   */
  get password(): string {
    return this._password;
  }

  /**
   * Sets the password for sign-in.
   * @param value The password.
   */
  set password(value: string) {
    this._password = value;
  }
}
