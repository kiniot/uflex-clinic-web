import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { ChangePasswordDialog } from './change-password-dialog';
import { AppError } from '../../../../shared/domain/model/app-error';
import {
  globalAppErrorCatalog,
  provideAppErrorCatalog,
} from '../../../../shared/application/app-error-catalog';
import { iamAppErrorCatalog } from '../../../application/iam-error-catalog';

describe('ChangePasswordDialog', () => {
  const changeMyPassword = vi.fn();

  beforeEach(async () => {
    changeMyPassword.mockReset();

    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialog, TranslateModule.forRoot()],
      providers: [
        provideAppErrorCatalog(globalAppErrorCatalog),
        provideAppErrorCatalog(iamAppErrorCatalog),
        {
          provide: IamStore,
          useValue: {
            changeMyPassword,
          },
        },
      ],
    }).compileComponents();
  });

  it('uses the shared resolver and keeps the inline invalid-current-password message', async () => {
    changeMyPassword.mockRejectedValue(
      new AppError({
        kind: 'http',
        code: 'INVALID_CREDENTIALS',
        status: 401,
        title: 'Unauthorized',
        path: '/api/v1/users/me/password',
        timestamp: null,
        operation: 'Change password',
        cause: null,
        isNetworkError: false,
      }),
    );

    const fixture = TestBed.createComponent(ChangePasswordDialog);
    const component = fixture.componentInstance;

    component.visible.set(true);
    component['form'].setValue({
      currentPassword: 'Current#123',
      newPassword: 'NewSecret#123',
      confirmPassword: 'NewSecret#123',
    });

    await component['onSubmit']();

    expect(component['feedback']).toEqual({
      severity: 'error',
      message: 'changePassword.error.invalidCurrent',
    });
  });
});
