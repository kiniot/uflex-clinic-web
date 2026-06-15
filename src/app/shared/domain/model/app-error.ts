export type AppErrorCode = string;
export type AppErrorKind = 'http' | 'network' | 'unknown';

export interface BackendApiErrorPayload {
  code?: string | null;
  message?: string | null;
  status?: number | null;
  title?: string | null;
  timestamp?: string | null;
  path?: string | null;
}

export interface AppErrorProps {
  kind: AppErrorKind;
  code: AppErrorCode;
  status: number;
  title: string | null;
  path: string | null;
  timestamp: string | null;
  operation?: string;
  cause?: unknown;
  isNetworkError: boolean;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly code: AppErrorCode;
  readonly status: number;
  readonly title: string | null;
  readonly path: string | null;
  readonly timestamp: string | null;
  readonly operation?: string;
  override readonly cause?: unknown;
  readonly isNetworkError: boolean;

  constructor(props: AppErrorProps) {
    super(props.operation ?? props.title ?? props.code);
    this.name = 'AppError';
    this.kind = props.kind;
    this.code = props.code;
    this.status = props.status;
    this.title = props.title;
    this.path = props.path;
    this.timestamp = props.timestamp;
    this.operation = props.operation;
    this.cause = props.cause;
    this.isNetworkError = props.isNetworkError;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
