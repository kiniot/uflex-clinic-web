import { ChangePasswordCommand } from './change-password.command';

describe('ChangePasswordCommand', () => {
  it('exposes both the current and the new password from the resource', () => {
    const command = new ChangePasswordCommand({
      currentPassword: 'OldPassword#1',
      newPassword: 'NewPassword#2'
    });

    expect(command.currentPassword).toBe('OldPassword#1');
    expect(command.newPassword).toBe('NewPassword#2');
  });

  it('allows replacing the current password through the setter', () => {
    const command = new ChangePasswordCommand({
      currentPassword: 'OldOne',
      newPassword: 'NewOne'
    });

    command.currentPassword = 'EvenOlder';
    command.newPassword = 'BrandNew';

    expect(command.currentPassword).toBe('EvenOlder');
    expect(command.newPassword).toBe('BrandNew');
  });
});
