import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { Forbidden } from './forbidden';

describe('Forbidden', () => {
  it('shows the portal CTA for users with a valid portal', () => {
    TestBed.configureTestingModule({
      imports: [Forbidden, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            currentPortalLandingRoute: signal('/clinic-admin').asReadonly(),
            hasPortalAccess: () => true,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(Forbidden);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('forbidden.go-portal');
  });

  it('sends unsupported roles to sign-in', () => {
    TestBed.configureTestingModule({
      imports: [Forbidden, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            currentPortalLandingRoute: signal(null).asReadonly(),
            hasPortalAccess: () => false,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(Forbidden);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const component = fixture.componentInstance;

    component['navigateToPrimaryAction']();

    expect(navigateSpy).toHaveBeenCalledWith(['/sign-in']);
  });
});
