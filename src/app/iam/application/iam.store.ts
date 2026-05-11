import { computed, Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { ChangePasswordCommand } from '../domain/model/change-password.command';

const ROLE_TO_HOME_ROUTE: Record<string, string> = {
  ROLE_CLINIC_ADMIN: '/clinic-admin/therapy',
  ROLE_PHYSIOTHERAPIST: '/physiotherapist',
  ROLE_PATIENT: '/home',
  ROLE_USER: '/home'
};

const FALLBACK_HOME_ROUTE = '/home';

interface JwtPayload {
  sub?: string;
  email?: string;
  roles?: string[];
  tenantId?: string | null;
  exp?: number;
}

/**
 * Application service store for managing Identity and Access Management state in the IAM bounded context.
 * Handles user authentication, sign-in, sign-up, password change, and session restoration.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentEmailSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<string | null>(null);
  private readonly currentRolesSignal = signal<string[]>([]);
  private readonly currentTenantIdSignal = signal<string | null>(null);
  private readonly usersSignal = signal<Array<User>>([]);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly loadingUsers = signal<boolean>(false);
  readonly currentEmail = this.currentEmailSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentRoles = this.currentRolesSignal.asReadonly();
  readonly currentTenantId = this.currentTenantIdSignal.asReadonly();

  /**
   * @deprecated kept for backwards compatibility — use {@link currentEmail}.
   */
  readonly currentUsername = this.currentEmailSignal.asReadonly();

  readonly currentToken = computed(() =>
    this.isSignedIn() ? localStorage.getItem('token') : null
  );

  readonly users = this.usersSignal.asReadonly();
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor(private iamApi: IamApi) {
    this.restoreSessionFromStorage();
  }

  signIn(signInCommand: SignInCommand, router: Router) {
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentEmailSignal.set(signInResource.email);
        this.currentUserIdSignal.set(signInResource.id);
        this.currentRolesSignal.set(signInResource.roles ?? []);
        this.currentTenantIdSignal.set(signInResource.tenantId ?? null);
        const destination = this.resolveHomeRoute(signInResource.roles ?? []);
        router.navigate([destination]).then();
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.clearSession();
        router.navigate(['/iam/sign-in']).then();
      }
    });
  }

  signUp(signUpCommand: SignUpCommand, router: Router, redirectTo: string = '/iam/sign-in') {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate([redirectTo]).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.clearSession();
        router.navigate(['/iam/sign-up']).then();
      }
    });
  }

  signOut(router: Router) {
    localStorage.removeItem('token');
    this.clearSession();
    router.navigate(['/iam/sign-in']).then();
  }

  /**
   * Calls the backend to change the current user's password.
   * Returns a Promise so the caller can show success/error feedback in a modal.
   */
  changeMyPassword(command: ChangePasswordCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      this.iamApi.changeMyPassword(command).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  private clearSession() {
    this.isSignedInSignal.set(false);
    this.currentEmailSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    this.currentTenantIdSignal.set(null);
  }

  private resolveHomeRoute(roles: string[]): string {
    for (const role of roles) {
      const route = ROLE_TO_HOME_ROUTE[role];
      if (route) return route;
    }
    return FALLBACK_HOME_ROUTE;
  }

  /**
   * Restores the in-memory session from a JWT in localStorage.
   * Runs on store construction so a page refresh keeps the user logged-in.
   * If the token is missing, malformed or expired, the session is cleared.
   */
  private restoreSessionFromStorage() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearSession();
      return;
    }
    const payload = this.decodeJwtPayload(token);
    if (!payload || (payload.exp != null && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem('token');
      this.clearSession();
      return;
    }
    this.isSignedInSignal.set(true);
    this.currentUserIdSignal.set(payload.sub ?? null);
    this.currentEmailSignal.set(payload.email ?? null);
    this.currentRolesSignal.set(payload.roles ?? []);
    this.currentTenantIdSignal.set(payload.tenantId ?? null);
  }

  private decodeJwtPayload(token: string): JwtPayload | null {
    try {
      const base64 = token.split('.')[1];
      if (!base64) return null;
      const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '=='.slice(0, (4 - (normalized.length % 4)) % 4);
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
