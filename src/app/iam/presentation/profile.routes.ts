import {Routes} from '@angular/router';

const profileSettings = () =>
  import('./views/profile-settings/profile-settings').then(m => m.ProfileSettings);

/**
 * Authenticated profile routes for the IAM bounded context. Mounted by
 * portals (clinic-admin, physiotherapist) under their /profile path.
 */
export const profileRoutes: Routes = [
  {path: '', loadComponent: profileSettings}
];
