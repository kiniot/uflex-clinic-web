import { Routes } from '@angular/router';

const subscriptionManagement = () =>
  import('./views/subscription-management/subscription-management').then(m => m.SubscriptionManagement);
const subscriptionPage = () =>
  import('./pages/subscription-page/subscription-page').then((m) => m.SubscriptionPage);

/**
 * Routes for the Subscription bounded context.
 */
export const subscriptionRoutes: Routes = [
  {path: '', loadComponent: subscriptionManagement}
];
export const subscriptionRoutes: Routes = [{ path: '', loadComponent: subscriptionPage }];
