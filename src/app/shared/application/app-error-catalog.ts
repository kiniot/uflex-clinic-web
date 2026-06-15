import { InjectionToken, Provider } from '@angular/core';
import { AppErrorCode } from '../domain/model/app-error';

export type AppErrorSeverity = 'error' | 'warn';

export interface AppErrorMessageDefinition {
  detailKey: string;
  severity?: AppErrorSeverity;
  summaryKey?: string;
}

export type AppErrorMessageCatalog = Readonly<Record<AppErrorCode, AppErrorMessageDefinition>>;

export const APP_ERROR_MESSAGE_CATALOGS = new InjectionToken<ReadonlyArray<AppErrorMessageCatalog>>(
  'APP_ERROR_MESSAGE_CATALOGS',
);

export function provideAppErrorCatalog(catalog: AppErrorMessageCatalog): Provider {
  return {
    provide: APP_ERROR_MESSAGE_CATALOGS,
    multi: true,
    useValue: catalog,
  };
}

export const globalAppErrorCatalog: AppErrorMessageCatalog = {
  NETWORK_ERROR: { detailKey: 'errors.network.unreachable' },
  AUTH_REQUIRED: { detailKey: 'errors.codes.AUTH_REQUIRED' },
  ACCESS_DENIED: { detailKey: 'errors.codes.ACCESS_DENIED' },
  BAD_REQUEST: { detailKey: 'errors.codes.BAD_REQUEST' },
  CONFLICT: { detailKey: 'errors.codes.CONFLICT' },
  NOT_FOUND: { detailKey: 'errors.codes.NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { detailKey: 'errors.codes.INTERNAL_SERVER_ERROR' },
};
