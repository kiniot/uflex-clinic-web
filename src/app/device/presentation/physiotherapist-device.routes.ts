import { Routes } from '@angular/router';

const deviceInventory = () =>
  import('./views/device-inventory/device-inventory').then((m) => m.DeviceInventory);

const deviceDetails = () =>
  import('./views/device-details/device-details').then((m) => m.DeviceDetails);

export const physiotherapistDeviceRoutes: Routes = [
  { path: '', loadComponent: deviceInventory },
  { path: 'details/:deviceId', loadComponent: deviceDetails },
];
