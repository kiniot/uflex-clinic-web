import {Routes} from '@angular/router';

const subscriptionManagement = () =>
  import('./views/subscription-management/subscription-management').then(m => m.SubscriptionManagement);

/**
 * Routes for the Subscription bounded context.
 */
export const subscriptionRoutes: Routes = [
  {path: '', loadComponent: subscriptionManagement}
];
