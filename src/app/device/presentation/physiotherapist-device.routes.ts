import {Routes} from '@angular/router';

const deviceInventory = () =>
  import('./views/device-inventory/device-inventory').then(m => m.DeviceInventory);

/**
 * Device routes for the physiotherapist role. Default is the Device
 * Inventory view (assignment-focused). The clinic admin's operational
 * sub-routes (calibrate, diagnostics, register, link) are exposed by
 * {@link deviceRoutes} instead.
 */
export const physiotherapistDeviceRoutes: Routes = [
  {path: '', loadComponent: deviceInventory}
];
