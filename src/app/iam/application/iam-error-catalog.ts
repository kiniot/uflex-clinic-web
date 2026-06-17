import { AppErrorMessageCatalog } from '../../shared/application/app-error-catalog';

export const iamAppErrorCatalog: AppErrorMessageCatalog = {
  EMAIL_ALREADY_IN_USE: { detailKey: 'errors.codes.EMAIL_ALREADY_IN_USE' },
  INVALID_CREDENTIALS: { detailKey: 'errors.codes.INVALID_CREDENTIALS' },
  ROLE_NOT_FOUND: { detailKey: 'errors.codes.ROLE_NOT_FOUND' },
  TENANT_ASSIGNMENT: { detailKey: 'errors.codes.TENANT_ASSIGNMENT' },
  USER_TENANT_ALREADY_ASSIGNED: { detailKey: 'errors.codes.USER_TENANT_ALREADY_ASSIGNED' },
  USER_TENANT_NOT_ASSIGNED: { detailKey: 'errors.codes.USER_TENANT_NOT_ASSIGNED' },
  USER_WITH_EMAIL_NOT_FOUND: { detailKey: 'errors.codes.USER_WITH_EMAIL_NOT_FOUND' },
  USER_WITH_ID_NOT_FOUND: { detailKey: 'errors.codes.USER_WITH_ID_NOT_FOUND' },
};
