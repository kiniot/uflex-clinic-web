import { computed, Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { ChangePasswordCommand } from '../domain/model/change-password.command';
import { SignInResource } from '../infrastructure/sign-in-response';
import { SignUpResource } from '../infrastructure/sign-up-response';
import { buildDemoJwt } from '../../shared/infrastructure/demo/demo-jwt';
import {
  DEMO_EMAIL,
  DEMO_MODE_STORAGE_KEY,
  DEMO_PHYSIOTHERAPIST_ID,
  DEMO_ROLES,
  DEMO_SESSION_DURATION_MS,
  DEMO_TENANT_ID,
  DEMO_TOKEN_STORAGE_KEY,
} from '../../shared/infrastructure/demo/demo.constants';

const ROLE_TO_HOME_ROUTE: Record<string, string> = {
  ROLE_CLINIC_ADMIN: '/clinic-admin',
  ROLE_PHYSIOTHERAPIST: '/physiotherapist',
};

const ROLE_PRIORITY = ['ROLE_CLINIC_ADMIN', 'ROLE_PHYSIOTHERAPIST'] as const;
type PortalRole = (typeof ROLE_PRIORITY)[number];

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
  private readonly isDemoModeSignal = signal<boolean>(false);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly isDemoMode = this.isDemoModeSignal.asReadonly();
  readonly loadingUsers = signal<boolean>(false);
  readonly currentEmail = this.currentEmailSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentRoles = this.currentRolesSignal.asReadonly();
  readonly currentTenantId = this.currentTenantIdSignal.asReadonly();
  readonly currentEffectiveRole = computed<PortalRole | null>(() =>
    this.resolveEffectiveRole(this.currentRolesSignal()),
  );
  readonly currentPortalLandingRoute = computed(() =>
    this.portalLandingRouteForRoles(this.currentRolesSignal()),
  );

  /**
   * @deprecated kept for backwards compatibility — use {@link currentEmail}.
   */
  readonly currentUsername = this.currentEmailSignal.asReadonly();

  readonly currentToken = computed(() => {
    if (!this.isSignedIn()) return null;
    if (this.isDemoModeSignal()) return sessionStorage.getItem(DEMO_TOKEN_STORAGE_KEY);
    return localStorage.getItem('token') ?? sessionStorage.getItem('token');
  });

  readonly users = this.usersSignal.asReadonly();
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor(private iamApi: IamApi) {
    this.restoreSessionFromStorage();
  }

  signIn(
    signInCommand: SignInCommand,
    router: Router,
    redirectTo?: string | null,
    rememberMe = true,
  ): Promise<SignInResource> {
    return new Promise((resolve, reject) => {
      this.iamApi.signIn(signInCommand).subscribe({
        next: (signInResource) => {
          this.applyAuthenticatedUser(signInResource, rememberMe);
          if (redirectTo === null) {
            resolve(signInResource);
            return;
          }
          const destination =
            redirectTo ??
            this.portalLandingRouteForRoles(signInResource.roles ?? []) ??
            '/forbidden';
          router.navigate([destination]).then(() => resolve(signInResource));
        },
        error: (err) => {
          console.error('Sign-in failed:', err);
          this.clearSession();
          if (redirectTo === null) {
            reject(err);
            return;
          }
          router.navigate(['/sign-in']).then(() => reject(err));
        },
      });
    });
  }

  signUp(
    signUpCommand: SignUpCommand,
    router: Router,
    redirectTo: string | null = '/sign-in',
  ): Promise<SignUpResource> {
    return new Promise((resolve, reject) => {
      this.iamApi.signUp(signUpCommand).subscribe({
        next: (signUpResource) => {
          console.log('Sign-up successful:', signUpResource);
          if (redirectTo === null) {
            resolve(signUpResource);
            return;
          }
          router.navigate([redirectTo]).then(() => resolve(signUpResource));
        },
        error: (err) => {
          console.error('Sign-up failed:', err);
          this.clearSession();
          if (redirectTo === null) {
            reject(err);
            return;
          }
          router.navigate(['/sign-up']).then(() => reject(err));
        },
      });
    });
  }

  signOut(router: Router) {
    sessionStorage.removeItem(DEMO_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    this.clearSession();
    router.navigate(['/sign-in']).then();
  }

  resetSession() {
    this.clearSession();
  }

  /**
   * Starts a client-only guest session: no HTTP call, no real backend involved.
   * Used for the portfolio "Ver demo" flow when the real backend is off.
   */
  activateDemoSession(): void {
    const exp = Math.floor((Date.now() + DEMO_SESSION_DURATION_MS) / 1000);
    const token = buildDemoJwt({
      sub: DEMO_PHYSIOTHERAPIST_ID,
      email: DEMO_EMAIL,
      roles: DEMO_ROLES,
      tenantId: DEMO_TENANT_ID,
      exp,
    });
    sessionStorage.setItem(DEMO_TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, '1');
    this.isDemoModeSignal.set(true);
    this.isSignedInSignal.set(true);
    this.currentUserIdSignal.set(DEMO_PHYSIOTHERAPIST_ID);
    this.currentEmailSignal.set(DEMO_EMAIL);
    this.currentRolesSignal.set(DEMO_ROLES);
    this.currentTenantIdSignal.set(DEMO_TENANT_ID);
  }

  exitDemoSession(): void {
    sessionStorage.removeItem(DEMO_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    this.isDemoModeSignal.set(false);
    this.clearSession();
  }

  /**
   * Calls the backend to change the current user's password.
   * Returns a Promise so the caller can show success/error feedback in a modal.
   */
  changeMyPassword(command: ChangePasswordCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      this.iamApi.changeMyPassword(command).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  private clearSession() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.isDemoModeSignal.set(false);
    this.currentEmailSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    this.currentTenantIdSignal.set(null);
  }

  hasPortalAccess(roles: string[] = this.currentRolesSignal()): boolean {
    return this.resolveEffectiveRole(roles) !== null;
  }

  portalLandingRouteForRoles(roles: string[] = this.currentRolesSignal()): string | null {
    const effectiveRole = this.resolveEffectiveRole(roles);
    return effectiveRole ? ROLE_TO_HOME_ROUTE[effectiveRole] : null;
  }

  resolveEffectiveRole(roles: string[] = this.currentRolesSignal()): PortalRole | null {
    for (const role of ROLE_PRIORITY) {
      if (roles.includes(role)) {
        return role;
      }
    }
    return null;
  }

  /**
   * Restores the in-memory session from a JWT, checking storage in priority order: a
   * "remember me" token in localStorage, then a session-only token in sessionStorage (set
   * when the user signed in without "remember me"), then a demo session. Runs on store
   * construction so a page refresh keeps the user logged in. If the token is missing,
   * malformed or expired, the session is cleared.
   */
  private restoreSessionFromStorage() {
    const persistedToken = localStorage.getItem('token');
    if (persistedToken) {
      this.restoreFromToken(persistedToken, false, () => localStorage.removeItem('token'));
      return;
    }

    const sessionOnlyToken = sessionStorage.getItem('token');
    if (sessionOnlyToken) {
      this.restoreFromToken(sessionOnlyToken, false, () => sessionStorage.removeItem('token'));
      return;
    }

    const demoToken = sessionStorage.getItem(DEMO_TOKEN_STORAGE_KEY);
    if (demoToken && sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === '1') {
      this.restoreFromToken(demoToken, true, () => {
        sessionStorage.removeItem(DEMO_TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
      });
      return;
    }

    this.clearSession();
  }

  private restoreFromToken(token: string, isDemo: boolean, onInvalid: () => void) {
    const payload = this.decodeJwtPayload(token);
    if (!payload || (payload.exp != null && payload.exp * 1000 < Date.now())) {
      onInvalid();
      this.clearSession();
      return;
    }
    this.isSignedInSignal.set(true);
    this.isDemoModeSignal.set(isDemo);
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
          .join(''),
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * `rememberMe` decides where the token lives: localStorage survives closing the browser,
   * sessionStorage is cleared with it. Either way the session lasts as long as the token
   * itself is valid — this only controls whether it outlives the browser being closed.
   */
  private applyAuthenticatedUser(signInResource: SignInResource, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', signInResource.token);
    this.isSignedInSignal.set(true);
    this.currentEmailSignal.set(signInResource.email);
    this.currentUserIdSignal.set(signInResource.id);
    this.currentRolesSignal.set(signInResource.roles ?? []);
    this.currentTenantIdSignal.set(signInResource.tenantId ?? null);
  }
}
