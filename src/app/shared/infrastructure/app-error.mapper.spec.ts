import { HttpErrorResponse } from '@angular/common/http';
import { AppError, isAppError } from '../domain/model/app-error';
import { toAppError } from './app-error.mapper';

describe('toAppError', () => {
  it('converts a backend payload into AppError', () => {
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: {
        code: 'AUTH_REQUIRED',
        title: 'Unauthorized',
        status: 401,
        path: '/api/v1/users/me',
        timestamp: '2026-06-15T16:35:05.777523-05:00',
      },
    });

    const appError = toAppError(error, 'Load current user');

    expect(isAppError(appError)).toBe(true);
    expect(appError).toMatchObject({
      kind: 'http',
      code: 'AUTH_REQUIRED',
      status: 401,
      title: 'Unauthorized',
      path: '/api/v1/users/me',
      timestamp: '2026-06-15T16:35:05.777523-05:00',
      operation: 'Load current user',
      isNetworkError: false,
    });
  });

  it('falls back to HTTP_<STATUS> when the backend payload has no code', () => {
    const error = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
      error: {
        status: 422,
        title: 'Unprocessable Entity',
      },
    });

    const appError = toAppError(error);

    expect(appError.code).toBe('HTTP_422');
    expect(appError.status).toBe(422);
  });

  it('marks network errors correctly', () => {
    const error = new HttpErrorResponse({
      status: 0,
      error: new ErrorEvent('NetworkError', { message: 'Connection lost' }),
    });

    const appError = toAppError(error);

    expect(appError.kind).toBe('network');
    expect(appError.code).toBe('NETWORK_ERROR');
    expect(appError.isNetworkError).toBe(true);
  });

  it('returns the same AppError instance when already normalized', () => {
    const error = new AppError({
      kind: 'http',
      code: 'AUTH_REQUIRED',
      status: 401,
      title: 'Unauthorized',
      path: '/api/v1/users/me',
      timestamp: null,
      operation: 'Load current user',
      cause: null,
      isNetworkError: false,
    });

    expect(toAppError(error)).toBe(error);
  });
});
