import {Routes} from '@angular/router';

const organizationManagement = () =>
  import('./views/organization-management/organization-management').then(m => m.OrganizationManagement);

/**
 * Routes for the Organization bounded context.
 */
export const organizationRoutes: Routes = [
  {path: '', loadComponent: organizationManagement}
];
