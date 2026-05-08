import {Routes} from '@angular/router';

const therapyManagement = () =>
  import('./views/therapy-management/therapy-management').then(m => m.TherapyManagement);
const registerExercise = () =>
  import('./views/register-exercise/register-exercise').then(m => m.RegisterExercise);

/**
 * Routes for the Therapy bounded context. Portals mount these under their
 * own path (e.g. /clinic-admin/therapy → therapy-management;
 * /clinic-admin/therapy/register → register-exercise).
 */
export const therapyRoutes: Routes = [
  {path: '', loadComponent: therapyManagement},
  {path: 'register', loadComponent: registerExercise}
];
