import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

export function rolePortalGuard(
  expectedRole: 'ROLE_CLINIC_ADMIN' | 'ROLE_PHYSIOTHERAPIST',
): CanActivateFn {
  return (): boolean | UrlTree => {
    const store = inject(IamStore);
    const router = inject(Router);

    if (!store.isSignedIn()) {
      return router.createUrlTree(['/sign-in']);
    }

    return store.currentEffectiveRole() === expectedRole
      ? true
      : router.createUrlTree(['/forbidden']);
  };
}
