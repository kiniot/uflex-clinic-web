import { TestBed } from '@angular/core/testing';
import { IamStore } from './iam.store';
import { IamApi } from '../infrastructure/iam-api';

describe('IamStore role resolution', () => {
  let store: IamStore;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: IamApi,
          useValue: {},
        },
      ],
    });

    store = TestBed.inject(IamStore);
  });

  it('prioritizes clinic admin over ROLE_USER', () => {
    expect(store.resolveEffectiveRole(['ROLE_USER', 'ROLE_CLINIC_ADMIN'])).toBe(
      'ROLE_CLINIC_ADMIN',
    );
    expect(store.portalLandingRouteForRoles(['ROLE_USER', 'ROLE_CLINIC_ADMIN'])).toBe(
      '/clinic-admin',
    );
  });

  it('prioritizes physiotherapist over ROLE_USER', () => {
    expect(store.resolveEffectiveRole(['ROLE_USER', 'ROLE_PHYSIOTHERAPIST'])).toBe(
      'ROLE_PHYSIOTHERAPIST',
    );
    expect(store.portalLandingRouteForRoles(['ROLE_USER', 'ROLE_PHYSIOTHERAPIST'])).toBe(
      '/physiotherapist',
    );
  });

  it('returns no portal for unsupported roles', () => {
    expect(store.resolveEffectiveRole(['ROLE_PATIENT'])).toBeNull();
    expect(store.portalLandingRouteForRoles(['ROLE_PATIENT'])).toBeNull();
    expect(store.hasPortalAccess(['ROLE_PATIENT'])).toBe(false);
  });
});
