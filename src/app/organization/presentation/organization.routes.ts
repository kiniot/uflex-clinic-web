import {Routes} from '@angular/router';

const organizationManagement = () =>
  import('./views/organization-management/organization-management').then(m => m.OrganizationManagement);
const registerPhysiotherapist = () =>
  import('./views/register-physiotherapist/register-physiotherapist').then(m => m.RegisterPhysiotherapist);

/**
 * Routes for the Organization bounded context. The default path is the
 * Organization page; staff/new mounts the physiotherapist registration
 * view alongside it.
 */
export const organizationRoutes: Routes = [
  {path: '', loadComponent: organizationManagement},
  {path: 'staff/new', loadComponent: registerPhysiotherapist}
];
