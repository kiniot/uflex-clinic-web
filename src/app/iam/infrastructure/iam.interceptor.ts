import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor for adding authorization headers to requests in the infrastructure layer of the IAM bounded context.
 * Injects the Bearer token from the IAM store if available.
 */
export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);
  const token =
    store.currentToken() ??
    localStorage.getItem('token') ??
    sessionStorage.getItem('token') ??
    localStorage.getItem('jwt_token') ??
    sessionStorage.getItem('jwt_token');
  const handledRequest = token
    ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
    : request;
  return next(handledRequest);
};
