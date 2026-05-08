import {Routes} from '@angular/router';

const organizationView = () =>
  import('./views/organization-view/organization-view').then(m => m.OrganizationView);

/**
 * Organization routes for the physiotherapist role. Default is the
 * Organization View (unassigned-patient queue + staff directory).
 * The clinic admin's clinic-management view is exposed by
 * {@link organizationRoutes} instead.
 */
export const physiotherapistOrganizationRoutes: Routes = [
  {path: '', loadComponent: organizationView}
];
