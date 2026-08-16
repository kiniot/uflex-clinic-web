import { Routes } from '@angular/router';

const therapyPatientsHub = () =>
  import('./views/therapy-patients-hub/therapy-patients-hub').then((m) => m.TherapyPatientsHub);

const therapyTracking = () =>
  import('./views/therapy-tracking/therapy-tracking').then((m) => m.TherapyTracking);

/**
 * Therapy routes for the physiotherapist role: an index of the caseload, then one patient's
 * follow-up. Read-only throughout — driving a session (prepare / start / finalize) belongs to the
 * patient's mobile app. The clinic admin's exercise catalog is exposed by {@link therapyRoutes}.
 */
export const physiotherapistTherapyRoutes: Routes = [
  { path: '', loadComponent: therapyPatientsHub, data: { preload: true } },
  { path: ':patientId', loadComponent: therapyTracking },
];
