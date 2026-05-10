/**
 * Command object for changing the authenticated user's password.
 */
export class ChangePasswordCommand {
  private _currentPassword: string;
  private _newPassword: string;

  constructor(resource: { currentPassword: string; newPassword: string }) {
    this._currentPassword = resource.currentPassword;
    this._newPassword = resource.newPassword;
  }

  get currentPassword(): string {
    return this._currentPassword;
  }

  set currentPassword(value: string) {
    this._currentPassword = value;
  }

  get newPassword(): string {
    return this._newPassword;
  }

  set newPassword(value: string) {
    this._newPassword = value;
  }
}
