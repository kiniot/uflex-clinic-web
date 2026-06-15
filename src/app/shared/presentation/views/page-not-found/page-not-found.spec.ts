import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  it('shows a portal CTA for authenticated users with a portal', () => {
    TestBed.configureTestingModule({
      imports: [PageNotFound, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: IamStore,
          useValue: {
            currentPortalLandingRoute: signal('/physiotherapist').asReadonly(),
            hasPortalAccess: () => true,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(PageNotFound);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('page-not-found.go-portal');
  });
});
