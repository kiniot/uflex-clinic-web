import { Routes } from '@angular/router';

const deviceManagement = () =>
  import('./views/device-management/device-management').then((m) => m.DeviceManagement);
const deviceCalibration = () =>
  import('./views/device-calibration/device-calibration').then((m) => m.DeviceCalibration);
const deviceDiagnostics = () =>
  import('./views/device-diagnostics/device-diagnostics').then((m) => m.DeviceDiagnostics);
const linkPatient = () => import('./views/link-patient/link-patient').then((m) => m.LinkPatient);
const deviceDetails = () =>
  import('./views/device-details/device-details').then((m) => m.DeviceDetails);

/**
 * Routes for the Device bounded context. Portals mount these under their
 * own path: device-management is the default; calibrate, diagnostics, and
 * link are siblings reached from the inventory header actions. Devices are
 * provisioned globally (ROLE_DEVELOPER) and auto-assigned to a clinic on
 * subscription activation, so there is no per-clinic registration route.
 */
export const deviceRoutes: Routes = [
  { path: '', loadComponent: deviceManagement },
  { path: 'details/:deviceId', loadComponent: deviceDetails },
  { path: 'calibrate', loadComponent: deviceCalibration },
  { path: 'diagnostics', loadComponent: deviceDiagnostics },
  { path: 'link', loadComponent: linkPatient },
];
