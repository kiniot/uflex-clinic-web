import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { IamStore } from '../application/iam.store';
import { rolePortalGuard } from './role-portal.guard';

describe('rolePortalGuard', () => {
  function runGuard(expectedRole: 'ROLE_CLINIC_ADMIN' | 'ROLE_PHYSIOTHERAPIST') {
    return TestBed.runInInjectionContext(() =>
      rolePortalGuard(expectedRole)({} as never, {} as never),
    );
  }

  it('allows access when the effective role matches', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            isSignedIn: signal(true).asReadonly(),
            currentEffectiveRole: signal('ROLE_CLINIC_ADMIN').asReadonly(),
          },
        },
      ],
    });

    expect(runGuard('ROLE_CLINIC_ADMIN')).toBe(true);
  });

  it('redirects to forbidden when the user is authenticated but belongs to another portal', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            isSignedIn: signal(true).asReadonly(),
            currentEffectiveRole: signal('ROLE_PHYSIOTHERAPIST').asReadonly(),
          },
        },
      ],
    });

    const result = runGuard('ROLE_CLINIC_ADMIN') as UrlTree;
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result)).toBe('/forbidden');
  });

  it('redirects to sign-in when the user is not authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            isSignedIn: signal(false).asReadonly(),
            currentEffectiveRole: signal(null).asReadonly(),
          },
        },
      ],
    });

    const result = runGuard('ROLE_CLINIC_ADMIN') as UrlTree;
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result)).toBe('/sign-in');
  });
});
