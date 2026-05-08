import {Routes} from '@angular/router';

const profileManagement = () =>
  import('./views/profile-management/profile-management').then(m => m.ProfileManagement);

/**
 * Authenticated profile routes for the IAM bounded context. Mounted by
 * portals (clinic-admin, physiotherapist) under their /profile path.
 */
export const profileRoutes: Routes = [
  {path: '', loadComponent: profileManagement}
];
