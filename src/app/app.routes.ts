import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { iamGuard } from './iam/infrastructure/iam.guard';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const iamRoutes = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);
const clinicAdminPortalRoutes = () =>
  import('./shared/presentation/portals/clinic-admin-portal/clinic-admin-portal.routes')
    .then((m) => m.clinicAdminPortalRoutes);
const physiotherapistPortalRoutes = () =>
  import('./shared/presentation/portals/physiotherapist-portal/physiotherapist-portal.routes')
    .then((m) => m.physiotherapistPortalRoutes);
const subscriptionRoutes = () =>
  import('./subscription/presentation/subscription.routes').then((m) => m.subscriptionRoutes);

const baseTitle = 'KinIoT - uFlex';

/**
 * Main routes configuration for the application in the presentation layer.
 * Bounded contexts (iam, therapy, device, organization, subscription, ...)
 * own their views; portals compose those views per role.
 */
export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`, canActivate: [iamGuard] },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: 'iam', loadChildren: iamRoutes },
  { path: 'clinic-admin', loadChildren: clinicAdminPortalRoutes, title: `${baseTitle} - Clinic Admin` },
  { path: 'physiotherapist', loadChildren: physiotherapistPortalRoutes, title: `${baseTitle} - Physiotherapist` },
  {
    path: 'subscription',
    loadChildren: subscriptionRoutes,
    title: `${baseTitle} - Subscription`,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
