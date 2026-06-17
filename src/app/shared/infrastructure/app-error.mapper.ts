import { HttpErrorResponse } from '@angular/common/http';
import {
  AppError,
  AppErrorCode,
  BackendApiErrorPayload,
  isAppError,
} from '../domain/model/app-error';

const HTTP_STATUS_FALLBACK_PREFIX = 'HTTP_';
const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
const UNEXPECTED_ERROR_CODE = 'INTERNAL_SERVER_ERROR';

function isBackendApiErrorPayload(error: unknown): error is BackendApiErrorPayload {
  return typeof error === 'object' && error !== null;
}

function fallbackHttpCode(status: number): AppErrorCode {
  return status > 0 ? `${HTTP_STATUS_FALLBACK_PREFIX}${status}` : UNEXPECTED_ERROR_CODE;
}

export function toAppError(error: HttpErrorResponse | unknown, operation?: string): AppError {
  if (isAppError(error)) return error;

  if (error instanceof HttpErrorResponse) {
    const payload = isBackendApiErrorPayload(error.error) ? error.error : null;
    const isNetworkError = error.error instanceof ErrorEvent || error.status === 0;
    const status = Number(payload?.status ?? error.status ?? 0);
    const code = isNetworkError
      ? NETWORK_ERROR_CODE
      : (payload?.code?.trim() ?? '') || fallbackHttpCode(status);

    return new AppError({
      kind: isNetworkError ? 'network' : 'http',
      code,
      status,
      title: payload?.title ?? error.statusText ?? null,
      path: payload?.path ?? null,
      timestamp: payload?.timestamp ?? null,
      operation,
      cause: error,
      isNetworkError,
    });
  }

  return new AppError({
    kind: 'unknown',
    code: UNEXPECTED_ERROR_CODE,
    status: 0,
    title: null,
    path: null,
    timestamp: null,
    operation,
    cause: error,
    isNetworkError: false,
  });
}
