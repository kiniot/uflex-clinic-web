import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SignUpForm } from './sign-up-form';
import { IamStore } from '../../../application/iam.store';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { SubscriptionStore } from '../../../../subscription/application/subscription.store';
import { AppError } from '../../../../shared/domain/model/app-error';
import {
  globalAppErrorCatalog,
  provideAppErrorCatalog,
} from '../../../../shared/application/app-error-catalog';
import { iamAppErrorCatalog } from '../../../application/iam-error-catalog';

describe('SignUpForm', () => {
  const signUp = vi.fn();
  const signIn = vi.fn();
  const resetSession = vi.fn();

  beforeEach(async () => {
    signUp.mockReset();
    signIn.mockReset();
    resetSession.mockReset();

    await TestBed.configureTestingModule({
      imports: [SignUpForm, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        provideAppErrorCatalog(globalAppErrorCatalog),
        provideAppErrorCatalog(iamAppErrorCatalog),
        {
          provide: IamStore,
          useValue: {
            signUp,
            signIn,
            resetSession,
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            createClinic: vi.fn(),
          },
        },
        {
          provide: SubscriptionStore,
          useValue: {
            publicTiers: signal([]).asReadonly(),
            isLoadingCatalog: signal(false).asReadonly(),
            selectedTier: signal(null).asReadonly(),
            selectedTierSlug: signal(null).asReadonly(),
            selectedBillingPeriod: signal('MONTHLY').asReadonly(),
            selectedCurrency: signal('PEN').asReadonly(),
            selectedBasePrice: signal(null).asReadonly(),
            selectedKitUnitPrice: signal(null).asReadonly(),
            selectedKitCharge: signal(null).asReadonly(),
            selectedGrandTotal: signal(null).asReadonly(),
            normalizedRequestedTotalKits: signal(1).asReadonly(),
            additionalKitCount: signal(0).asReadonly(),
            canContinueWithSelfServeSelection: signal(true).asReadonly(),
            loadCatalog: vi.fn().mockResolvedValue([]),
            hydrateSelectionFromQuery: vi.fn(),
            selectTier: vi.fn(),
            selectBillingPeriod: vi.fn(),
            selectCurrency: vi.fn(),
            updateRequestedTotalKits: vi.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  it('shows the IAM-specific toast when account creation fails with EMAIL_ALREADY_IN_USE', async () => {
    signUp.mockRejectedValue(
      new AppError({
        kind: 'http',
        code: 'EMAIL_ALREADY_IN_USE',
        status: 409,
        title: 'Conflict',
        path: '/api/v1/authentication/sign-up',
        timestamp: null,
        operation: 'Sign up',
        cause: null,
        isNetworkError: false,
      }),
    );

    const fixture = TestBed.createComponent(SignUpForm);
    const component = fixture.componentInstance;
    const messageService = TestBed.inject(MessageService);
    const addSpy = vi.spyOn(messageService, 'add');

    component.accountForm.setValue({
      email: 'clinic@example.com',
      password: 'Secret#123',
      confirmPassword: 'Secret#123',
    });

    await component['performSignUp']();

    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'signUp.notifications.errorSummary',
        detail: 'errors.codes.EMAIL_ALREADY_IN_USE',
      }),
    );
    expect(signIn).not.toHaveBeenCalled();
  });
});
