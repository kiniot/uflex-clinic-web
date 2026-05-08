import {Routes} from '@angular/router';

const portal = () => import('./clinic-admin-portal').then(m => m.ClinicAdminPortal);
const therapyRoutes = () => import('../../../../therapy/presentation/therapy.routes').then(m => m.therapyRoutes);
const deviceRoutes = () => import('../../../../device/presentation/device.routes').then(m => m.deviceRoutes);
const organizationRoutes = () => import('../../../../organization/presentation/organization.routes').then(m => m.organizationRoutes);
const subscriptionRoutes = () => import('../../../../subscription/presentation/subscription.routes').then(m => m.subscriptionRoutes);
const profileRoutes = () => import('../../../../iam/presentation/profile.routes').then(m => m.profileRoutes);

/**
 * Clinic Admin portal routes. The portal shell wraps every child view and
 * lazy-loads each bounded context's own route tree under its sub-path.
 * The index path redirects to the Therapy Management page.
 */
export const clinicAdminPortalRoutes: Routes = [
  {
    path: '',
    loadComponent: portal,
    children: [
      {path: '', redirectTo: 'therapy', pathMatch: 'full'},
      {path: 'therapy', loadChildren: therapyRoutes},
      {path: 'device', loadChildren: deviceRoutes},
      {path: 'organization', loadChildren: organizationRoutes},
      {path: 'subscription', loadChildren: subscriptionRoutes},
      {path: 'profile', loadChildren: profileRoutes}
    ]
  }
];
