import { Routes } from '@angular/router';

const portal = () => import('./clinic-admin-portal').then((m) => m.ClinicAdminPortal);
const exerciseRoutes = () =>
  import('../../../../planning/presentation/exercise.routes').then((m) => m.exerciseRoutes);
const deviceRoutes = () =>
  import('../../../../device/presentation/device.routes').then((m) => m.deviceRoutes);
const organizationRoutes = () =>
  import('../../../../organization/presentation/organization.routes').then(
    (m) => m.organizationRoutes,
  );
const subscriptionRoutes = () =>
  import('../../../../subscription/presentation/subscription.routes').then(
    (m) => m.subscriptionRoutes,
  );
const clinicAdminProfile = () =>
  import('../../../../organization/presentation/views/clinic-admin-profile/clinic-admin-profile').then(
    (m) => m.ClinicAdminProfile,
  );

/**
 * Clinic Admin portal routes. The portal shell wraps every child view and
 * lazy-loads each bounded context's own route tree under its sub-path.
 * The index path redirects to the Organization page.
 */
export const clinicAdminPortalRoutes: Routes = [
  {
    path: '',
    loadComponent: portal,
    children: [
      { path: '', redirectTo: 'organization', pathMatch: 'full' },
      { path: 'exercises', loadChildren: exerciseRoutes, data: { preload: true } },
      { path: 'device', loadChildren: deviceRoutes, data: { preload: true } },
      { path: 'organization', loadChildren: organizationRoutes, data: { preload: true } },
      { path: 'subscription', loadChildren: subscriptionRoutes, data: { preload: true } },
      { path: 'profile', loadComponent: clinicAdminProfile, data: { preload: true } },
    ],
  },
];
