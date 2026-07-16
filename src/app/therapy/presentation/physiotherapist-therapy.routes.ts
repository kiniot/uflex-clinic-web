import { Routes } from '@angular/router';

const therapyTracking = () =>
  import('./views/therapy-tracking/therapy-tracking').then((m) => m.TherapyTracking);

/**
 * Therapy routes for the physiotherapist role: a read-only follow-up centre over the patient's
 * therapy history. Driving a session (prepare / start / finalize) is the patient's mobile app's
 * job. The clinic admin's exercise catalog is exposed by {@link therapyRoutes} instead.
 */
export const physiotherapistTherapyRoutes: Routes = [{ path: '', loadComponent: therapyTracking }];
