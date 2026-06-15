import { TestBed } from '@angular/core/testing';
import { AppError } from '../domain/model/app-error';
import { AppErrorMessageResolver } from './app-error-message-resolver';
import { globalAppErrorCatalog, provideAppErrorCatalog } from './app-error-catalog';
import { iamAppErrorCatalog } from '../../iam/application/iam-error-catalog';

describe('AppErrorMessageResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppErrorMessageResolver,
        provideAppErrorCatalog(globalAppErrorCatalog),
        provideAppErrorCatalog(iamAppErrorCatalog),
      ],
    });
  });

  it('resolves IAM specific codes first', () => {
    const resolver = TestBed.inject(AppErrorMessageResolver);

    const resolved = resolver.resolveMessage(
      new AppError({
        kind: 'http',
        code: 'INVALID_CREDENTIALS',
        status: 401,
        title: 'Unauthorized',
        path: null,
        timestamp: null,
        operation: 'Sign in',
        cause: null,
        isNetworkError: false,
      }),
    );

    expect(resolved.detailKey).toBe('errors.codes.INVALID_CREDENTIALS');
    expect(resolved.summaryKey).toBe('errors.toast.errorSummary');
  });

  it('resolves global framework codes', () => {
    const resolver = TestBed.inject(AppErrorMessageResolver);

    const authRequired = resolver.resolveMessage(
      new AppError({
        kind: 'http',
        code: 'AUTH_REQUIRED',
        status: 401,
        title: 'Unauthorized',
        path: null,
        timestamp: null,
        operation: 'Load protected resource',
        cause: null,
        isNetworkError: false,
      }),
    );
    const accessDenied = resolver.resolveMessage(
      new AppError({
        kind: 'http',
        code: 'ACCESS_DENIED',
        status: 403,
        title: 'Forbidden',
        path: null,
        timestamp: null,
        operation: 'Delete resource',
        cause: null,
        isNetworkError: false,
      }),
    );

    expect(authRequired.detailKey).toBe('errors.codes.AUTH_REQUIRED');
    expect(accessDenied.detailKey).toBe('errors.codes.ACCESS_DENIED');
  });

  it('uses HTTP status fallback keys for HTTP_<STATUS> codes', () => {
    const resolver = TestBed.inject(AppErrorMessageResolver);

    const resolved = resolver.resolveMessage(
      new AppError({
        kind: 'http',
        code: 'HTTP_422',
        status: 422,
        title: 'Unprocessable Entity',
        path: null,
        timestamp: null,
        operation: 'Create resource',
        cause: null,
        isNetworkError: false,
      }),
    );

    expect(resolved.detailKey).toBe('errors.http.422');
  });

  it('falls back to an unexpected error key for unknown errors', () => {
    const resolver = TestBed.inject(AppErrorMessageResolver);

    const resolved = resolver.resolveMessage(new Error('Unexpected'));

    expect(resolved.detailKey).toBe('errors.codes.INTERNAL_SERVER_ERROR');
  });
});
