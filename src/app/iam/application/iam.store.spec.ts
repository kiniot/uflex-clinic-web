import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IamStore } from './iam.store';
import { IamApi } from '../infrastructure/iam-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';

const buildJwt = (payload: Record<string, unknown>) => {
  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const header = encode({ alg: 'none', typ: 'JWT' });
  const body = encode(payload);
  return `${header}.${body}.signature`;
};

describe('IamStore', () => {
  const iamApiMock = {
    signIn: vi.fn(),
    signUp: vi.fn(),
    changeMyPassword: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  const buildStore = () => {
    TestBed.configureTestingModule({
      providers: [IamStore, { provide: IamApi, useValue: iamApiMock }],
    });
    return TestBed.inject(IamStore);
  };

  beforeEach(() => {
    localStorage.clear();
    iamApiMock.signIn.mockReset();
    iamApiMock.signUp.mockReset();
    iamApiMock.changeMyPassword.mockReset();
    routerMock.navigate.mockClear();
  });

  it('starts signed-out when localStorage has no token', () => {
    const store = buildStore();

    expect(store.isSignedIn()).toBe(false);
    expect(store.currentEmail()).toBeNull();
    expect(store.currentRoles()).toEqual([]);
  });

  it('restores the session from a non-expired JWT in localStorage', () => {
    const farFuture = Math.floor(Date.now() / 1000) + 60 * 60;
    localStorage.setItem(
      'token',
      buildJwt({
        sub: 'user-uuid',
        email: 'physio@uflex.io',
        roles: ['ROLE_PHYSIOTHERAPIST'],
        tenantId: 'tenant-111',
        exp: farFuture,
      }),
    );

    const store = buildStore();

    expect(store.isSignedIn()).toBe(true);
    expect(store.currentUserId()).toBe('user-uuid');
    expect(store.currentEmail()).toBe('physio@uflex.io');
    expect(store.currentRoles()).toEqual(['ROLE_PHYSIOTHERAPIST']);
    expect(store.currentTenantId()).toBe('tenant-111');
  });

  it('discards an expired token and stays signed-out', () => {
    const longGone = Math.floor(Date.now() / 1000) - 60;
    localStorage.setItem(
      'token',
      buildJwt({
        sub: 'old',
        email: 'old@uflex.io',
        roles: ['ROLE_USER'],
        exp: longGone,
      }),
    );

    const store = buildStore();

    expect(store.isSignedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('updates state and routes to the role home on a successful sign-in', async () => {
    iamApiMock.signIn.mockReturnValue(
      of({
        id: 'admin-uuid',
        email: 'admin@uflex.io',
        roles: ['ROLE_CLINIC_ADMIN'],
        tenantId: 'tenant-123',
        token: 'jwt-token-value',
      }),
    );
    const store = buildStore();

    await store.signIn(
      new SignInCommand({ email: 'admin@uflex.io', password: 'pwd' }),
      routerMock as unknown as Router,
    );

    expect(store.isSignedIn()).toBe(true);
    expect(store.currentEmail()).toBe('admin@uflex.io');
    expect(store.currentRoles()).toEqual(['ROLE_CLINIC_ADMIN']);
    expect(store.currentTenantId()).toBe('tenant-123');
    expect(localStorage.getItem('token')).toBe('jwt-token-value');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/clinic-admin/therapy']);
  });

  it('allows sign-in to complete without redirecting when onboarding continues in-place', async () => {
    iamApiMock.signIn.mockReturnValue(
      of({
        id: 'admin-uuid',
        email: 'admin@uflex.io',
        roles: ['ROLE_CLINIC_ADMIN'],
        tenantId: 'tenant-123',
        token: 'jwt-token-value',
      }),
    );
    const store = buildStore();

    await store.signIn(
      new SignInCommand({ email: 'admin@uflex.io', password: 'pwd' }),
      routerMock as unknown as Router,
      null,
    );

    expect(store.isSignedIn()).toBe(true);
    expect(localStorage.getItem('token')).toBe('jwt-token-value');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('allows sign-up to complete without redirecting when the flow continues in-place', async () => {
    iamApiMock.signUp.mockReturnValue(
      of({
        id: 'user-uuid',
        email: 'new@uflex.io',
        roles: ['ROLE_CLINIC_ADMIN'],
        tenantId: null,
      }),
    );
    const store = buildStore();

    await store.signUp(
      new SignUpCommand({ email: 'new@uflex.io', password: 'password123' }),
      routerMock as unknown as Router,
      null,
    );

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('clears the session and stays on the sign-in route when sign-in fails', async () => {
    iamApiMock.signIn.mockReturnValue(throwError(() => new Error('401')));
    const store = buildStore();

    await expect(
      store.signIn(
        new SignInCommand({ email: 'bad@uflex.io', password: 'wrong' }),
        routerMock as unknown as Router,
      ),
    ).rejects.toThrow('401');

    expect(store.isSignedIn()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/iam/sign-in']);
  });

  it('removes the token and clears the session on sign-out', () => {
    localStorage.setItem('token', 'whatever');
    const store = buildStore();

    store.signOut(routerMock as unknown as Router);

    expect(localStorage.getItem('token')).toBeNull();
    expect(store.isSignedIn()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/iam/sign-in']);
  });
});
