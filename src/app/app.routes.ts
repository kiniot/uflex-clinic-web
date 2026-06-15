import { Routes } from '@angular/router';
import { iamGuard } from './iam/infrastructure/iam.guard';
import { rolePortalGuard } from './iam/infrastructure/role-portal.guard';
import { SignInForm } from './iam/presentation/views/sign-in-form/sign-in-form';
import { SignUpForm } from './iam/presentation/views/sign-up-form/sign-up-form';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const forbidden = () =>
  import('./shared/presentation/views/forbidden/forbidden').then((m) => m.Forbidden);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const clinicAdminPortalRoutes = () =>
  import('./shared/presentation/portals/clinic-admin-portal/clinic-admin-portal.routes').then(
    (m) => m.clinicAdminPortalRoutes,
  );
const subscriptionRoutes = () =>
  import('./subscription/presentation/subscription.routes').then((m) => m.subscriptionRoutes);

const physiotherapistPortalRoutes = () =>
  import('./shared/presentation/portals/physiotherapist-portal/physiotherapist-portal.routes').then(
    (m) => m.physiotherapistPortalRoutes,
  );

const baseTitle = 'KinIoT - uFlex';

/**
 * Main routes configuration for the application in the presentation layer.
 * Bounded contexts (iam, therapy, device, organization, subscription, ...)
 * own their views; portals compose those views per role.
 */
export const routes: Routes = [
  { path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: 'forbidden', loadComponent: forbidden, title: `${baseTitle} - Forbidden` },
  { path: 'sign-in', component: SignInForm, title: `${baseTitle} - Sign In` },
  { path: 'sign-up', component: SignUpForm, title: `${baseTitle} - Sign Up` },
  { path: 'iam/sign-in', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'iam/sign-up', redirectTo: '/sign-up', pathMatch: 'full' },
  { path: 'subscription', loadChildren: subscriptionRoutes, canActivate: [iamGuard] },
  {
    path: 'clinic-admin',
    loadChildren: clinicAdminPortalRoutes,
    title: `${baseTitle} - Clinic Admin`,
    canActivate: [iamGuard, rolePortalGuard('ROLE_CLINIC_ADMIN')],
  },
  {
    path: 'physiotherapist',
    loadChildren: physiotherapistPortalRoutes,
    title: `${baseTitle} - Physiotherapist`,
    canActivate: [iamGuard, rolePortalGuard('ROLE_PHYSIOTHERAPIST')],
  },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
