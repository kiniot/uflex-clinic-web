import { Routes } from '@angular/router';

const subscriptionPage = () =>
  import('./pages/subscription-page/subscription-page').then((m) => m.SubscriptionPage);

/**
 * Routes for the Subscription bounded context presentation layer.
 */
export const subscriptionRoutes: Routes = [{ path: '', loadComponent: subscriptionPage }];
