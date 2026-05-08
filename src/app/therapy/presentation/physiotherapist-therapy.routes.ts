import {Routes} from '@angular/router';

const therapyRoster = () =>
  import('./views/therapy-roster/therapy-roster').then(m => m.TherapyRoster);

/**
 * Therapy routes for the physiotherapist role. The default view is the
 * patient roster (clinician's primary therapy interaction); the clinic
 * admin's exercise catalog is exposed by {@link therapyRoutes} instead.
 */
export const physiotherapistTherapyRoutes: Routes = [
  {path: '', loadComponent: therapyRoster}
];
