import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { ClinicAdminPortal } from './clinic-admin-portal';

describe('ClinicAdminPortal', () => {
  const loadCurrentClinicAdminOnce = vi.fn().mockResolvedValue(null);

  beforeEach(async () => {
    sessionStorage.clear();
    loadCurrentClinicAdminOnce.mockClear();

    await TestBed.configureTestingModule({
      imports: [ClinicAdminPortal, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            currentEmail: signal('admin@uflex.app').asReadonly(),
            currentEffectiveRole: signal('ROLE_CLINIC_ADMIN').asReadonly(),
            signOut: vi.fn(),
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            currentClinicAdminProfileStatus: signal('ready').asReadonly(),
            loadCurrentClinicAdminOnce,
          },
        },
      ],
    }).compileComponents();
  });

  it('includes the exercises category in the clinic admin navigation', () => {
    const fixture = TestBed.createComponent(ClinicAdminPortal);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    expect(
      component
        .navItems()
        .some((item: { route: string }) => item.route === '/clinic-admin/exercises'),
    ).toBe(true);
  });

  it('shows a pending badge on profile when clinic admin profile is missing', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ClinicAdminPortal, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            currentEmail: signal('admin@uflex.app').asReadonly(),
            currentEffectiveRole: signal('ROLE_CLINIC_ADMIN').asReadonly(),
            signOut: vi.fn(),
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            currentClinicAdminProfileStatus: signal('missing').asReadonly(),
            loadCurrentClinicAdminOnce,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ClinicAdminPortal);
    const component = fixture.componentInstance as any;
    fixture.detectChanges();

    const profileItem = component.navItems().find((item: { route: string }) => item.route === '/clinic-admin/profile');
    expect(profileItem?.badgeLabel).toBe('organization.profile.badge.pending');
    expect(component.profilePromptVisible()).toBe(true);
  });
});
