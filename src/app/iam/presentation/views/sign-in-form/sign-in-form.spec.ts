import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { IamStore } from '../../../application/iam.store';
import { SignInForm } from './sign-in-form';
import { AppError } from '../../../../shared/domain/model/app-error';
import {
  globalAppErrorCatalog,
  provideAppErrorCatalog,
} from '../../../../shared/application/app-error-catalog';
import { iamAppErrorCatalog } from '../../../application/iam-error-catalog';

describe('SignInForm', () => {
  const signIn = vi.fn();

  beforeEach(async () => {
    signIn.mockReset();

    await TestBed.configureTestingModule({
      imports: [SignInForm, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        provideAppErrorCatalog(globalAppErrorCatalog),
        provideAppErrorCatalog(iamAppErrorCatalog),
        {
          provide: IamStore,
          useValue: {
            signIn,
          },
        },
      ],
    }).compileComponents();
  });

  it('shows the IAM-specific toast for invalid credentials', async () => {
    signIn.mockRejectedValue(
      new AppError({
        kind: 'http',
        code: 'INVALID_CREDENTIALS',
        status: 401,
        title: 'Unauthorized',
        path: '/api/v1/authentication/sign-in',
        timestamp: null,
        operation: 'Sign in',
        cause: null,
        isNetworkError: false,
      }),
    );

    const fixture = TestBed.createComponent(SignInForm);
    const component = fixture.componentInstance;
    const messageService = TestBed.inject(MessageService);
    const addSpy = vi.spyOn(messageService, 'add');

    component.form.setValue({
      email: 'user@example.com',
      password: 'Secret#123',
      rememberMe: false,
    });

    await component.performSignIn();

    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'signIn.notifications.errorSummary',
        detail: 'errors.codes.INVALID_CREDENTIALS',
      }),
    );
  });
});
