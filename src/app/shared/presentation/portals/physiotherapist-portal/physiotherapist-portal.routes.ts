import {Routes} from '@angular/router';

const portal = () => import('./physiotherapist-portal').then(m => m.PhysiotherapistPortal);
const dashboard = () => import('./views/dashboard/dashboard').then(m => m.Dashboard);
const therapyRoutes = () => import('../../../../therapy/presentation/physiotherapist-therapy.routes').then(m => m.physiotherapistTherapyRoutes);
const planningRoutes = () => import('../../../../planning/presentation/planning.routes').then(m => m.planningRoutes);
const deviceRoutes = () => import('../../../../device/presentation/physiotherapist-device.routes').then(m => m.physiotherapistDeviceRoutes);
const organizationRoutes = () => import('../../../../organization/presentation/physiotherapist-organization.routes').then(m => m.physiotherapistOrganizationRoutes);

/**
 * Physiotherapist portal routes. The portal shell wraps every child
 * view; the index path redirects to the clinician's daily dashboard.
 */
export const physiotherapistPortalRoutes: Routes = [
  {
    path: '',
    loadComponent: portal,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadComponent: dashboard},
      {path: 'therapy', loadChildren: therapyRoutes},
      {path: 'planning', loadChildren: planningRoutes},
      {path: 'device', loadChildren: deviceRoutes},
      {path: 'organization', loadChildren: organizationRoutes}
    ]
  }
];
