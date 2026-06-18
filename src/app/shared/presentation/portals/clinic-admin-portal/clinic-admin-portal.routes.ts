import { Routes } from '@angular/router';

const portal = () => import('./clinic-admin-portal').then((m) => m.ClinicAdminPortal);
const therapyRoutes = () =>
  import('../../../../therapy/presentation/therapy.routes').then((m) => m.therapyRoutes);
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
      { path: 'exercises', loadChildren: exerciseRoutes },
      { path: 'therapy', loadChildren: therapyRoutes },
      { path: 'device', loadChildren: deviceRoutes },
      { path: 'organization', loadChildren: organizationRoutes },
      { path: 'subscription', loadChildren: subscriptionRoutes },
      { path: 'profile', loadComponent: clinicAdminProfile },
    ],
  },
];
