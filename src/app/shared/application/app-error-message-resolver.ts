import { inject, Injectable } from '@angular/core';
import { AppError, AppErrorCode } from '../domain/model/app-error';
import { toAppError } from '../infrastructure/app-error.mapper';
import {
  APP_ERROR_MESSAGE_CATALOGS,
  AppErrorMessageCatalog,
  AppErrorMessageDefinition,
  AppErrorSeverity,
} from './app-error-catalog';

export interface ResolvedAppErrorMessage {
  summaryKey: string;
  detailKey: string;
  severity: AppErrorSeverity;
}

export interface ResolveAppErrorMessageOptions {
  summaryKey?: string;
  fallbackDetailKey?: string;
  severity?: AppErrorSeverity;
}

const HTTP_STATUS_CODE_TO_GLOBAL_CODE: Record<number, AppErrorCode> = {
  400: 'BAD_REQUEST',
  401: 'AUTH_REQUIRED',
  403: 'ACCESS_DENIED',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  500: 'INTERNAL_SERVER_ERROR',
};

const HTTP_STATUS_MESSAGE_KEYS: Record<number, string> = {
  422: 'errors.http.422',
  429: 'errors.http.429',
  502: 'errors.http.502',
};

@Injectable({ providedIn: 'root' })
export class AppErrorMessageResolver {
  private readonly catalogs = inject(APP_ERROR_MESSAGE_CATALOGS, { optional: true }) ?? [];

  resolveMessage(
    error: unknown,
    options: ResolveAppErrorMessageOptions = {},
  ): ResolvedAppErrorMessage {
    const appError = toAppError(error);
    const definition = this.resolveDefinition(appError);
    const severity = options.severity ?? definition?.severity ?? 'error';

    return {
      summaryKey:
        options.summaryKey ?? definition?.summaryKey ?? this.defaultSummaryKeyForSeverity(severity),
      detailKey:
        definition?.detailKey ??
        options.fallbackDetailKey ??
        this.defaultDetailKeyForError(appError),
      severity,
    };
  }

  private resolveDefinition(error: AppError): AppErrorMessageDefinition | null {
    return (
      this.lookupInCatalogs(error.code) ??
      this.lookupHttpStatusFallback(error) ??
      this.lookupStatusMappedCode(error.status)
    );
  }

  private lookupHttpStatusFallback(error: AppError): AppErrorMessageDefinition | null {
    if (!error.code.startsWith('HTTP_')) return null;
    const detailKey = HTTP_STATUS_MESSAGE_KEYS[error.status];
    return detailKey ? { detailKey } : null;
  }

  private lookupStatusMappedCode(status: number): AppErrorMessageDefinition | null {
    const code = HTTP_STATUS_CODE_TO_GLOBAL_CODE[status];
    return code ? this.lookupInCatalogs(code) : null;
  }

  private lookupInCatalogs(code: AppErrorCode): AppErrorMessageDefinition | null {
    for (let index = this.catalogs.length - 1; index >= 0; index -= 1) {
      const catalog = this.catalogs[index] as AppErrorMessageCatalog | undefined;
      const definition = catalog?.[code];
      if (definition) return definition;
    }

    return null;
  }

  private defaultSummaryKeyForSeverity(severity: AppErrorSeverity): string {
    return severity === 'warn' ? 'errors.toast.warnSummary' : 'errors.toast.errorSummary';
  }

  private defaultDetailKeyForError(error: AppError): string {
    if (error.isNetworkError) return 'errors.network.unreachable';
    if (error.code.startsWith('HTTP_')) return 'errors.http.generic';
    return 'errors.unexpected.generic';
  }
}
