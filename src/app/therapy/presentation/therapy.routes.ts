import { Routes } from '@angular/router';

const therapyRoster = () =>
  import('./views/therapy-roster/therapy-roster').then((m) => m.TherapyRoster);

/**
 * Routes for the Therapy bounded context. The admin landing now focuses on
 * therapy sessions; exercise catalog management lives under `/exercises`.
 */
export const therapyRoutes: Routes = [
  { path: '', loadComponent: therapyRoster, data: { roleContext: 'admin' } },
  { path: 'register', redirectTo: '/clinic-admin/exercises/new', pathMatch: 'full' },
];
