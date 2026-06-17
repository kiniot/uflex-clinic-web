import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { ClinicAdminPortal } from './clinic-admin-portal';

describe('ClinicAdminPortal', () => {
  beforeEach(async () => {
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
});
