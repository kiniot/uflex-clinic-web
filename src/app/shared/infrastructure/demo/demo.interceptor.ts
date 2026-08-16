import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay } from 'rxjs';
import { IamStore } from '../../../iam/application/iam.store';
import { DemoRouter } from './demo-router';

/**
 * When a demo/guest session is active, resolves matching requests against the in-memory
 * {@link DemoRouter} instead of the network — no server involved. Registered before
 * `iamInterceptor` in app.config.ts so it fully owns the exchange for any route it recognizes.
 */
export const demoInterceptor: HttpInterceptorFn = (request, next) => {
  const iamStore = inject(IamStore);
  if (!iamStore.isDemoMode()) return next(request);

  const demoRouter = inject(DemoRouter);
  const handled = demoRouter.dispatch(request);
  if (!handled) return next(request);

  return handled.pipe(delay(0));
};
