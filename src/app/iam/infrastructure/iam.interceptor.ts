import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor for adding authorization headers to requests in the infrastructure layer of the IAM bounded context.
 * Injects the Bearer token from the IAM store if available.
 */
export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);
  if (request.url.includes('/authentication/')) {
    return next(request);
  }

  const token = store.currentToken();
  const handledRequest = token
    ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
    : request;
  return next(handledRequest);
};
