import {Routes} from '@angular/router';

const deviceManagement = () =>
  import('./views/device-management/device-management').then(m => m.DeviceManagement);

/**
 * Routes for the Device bounded context.
 */
export const deviceRoutes: Routes = [
  {path: '', loadComponent: deviceManagement}
];
