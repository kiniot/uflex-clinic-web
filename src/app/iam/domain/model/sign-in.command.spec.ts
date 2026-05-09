import { SignInCommand } from './sign-in.command';

describe('SignInCommand', () => {
  it('exposes the email and password supplied at construction', () => {
    const command = new SignInCommand({
      email: 'admin@clinic.io',
      password: 'Secret#123'
    });

    expect(command.email).toBe('admin@clinic.io');
    expect(command.password).toBe('Secret#123');
  });

  it('allows updating the credentials through setters', () => {
    const command = new SignInCommand({ email: 'a@b.io', password: 'x' });

    command.email = 'c@d.io';
    command.password = 'y';

    expect(command.email).toBe('c@d.io');
    expect(command.password).toBe('y');
  });
});
