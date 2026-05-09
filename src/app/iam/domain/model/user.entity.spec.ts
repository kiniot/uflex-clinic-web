import { User } from './user.entity';

describe('User entity (IAM)', () => {
  it('builds from a resource and exposes id, email and roles', () => {
    const user = new User({
      id: 'a1b2c3',
      email: 'physio@uflex.io',
      roles: ['ROLE_PHYSIOTHERAPIST']
    });

    expect(user.id).toBe('a1b2c3');
    expect(user.email).toBe('physio@uflex.io');
    expect(user.roles).toEqual(['ROLE_PHYSIOTHERAPIST']);
  });

  it('defaults roles to an empty array when none are provided', () => {
    const user = new User({ id: '1', email: 'patient@uflex.io' });

    expect(user.roles).toEqual([]);
  });

  it('allows mutating fields through setters', () => {
    const user = new User({ id: '1', email: 'old@uflex.io' });

    user.email = 'new@uflex.io';
    user.roles = ['ROLE_CLINIC_ADMIN'];

    expect(user.email).toBe('new@uflex.io');
    expect(user.roles).toEqual(['ROLE_CLINIC_ADMIN']);
  });
});
