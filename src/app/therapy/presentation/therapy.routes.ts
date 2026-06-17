import { Routes } from '@angular/router';

const therapySupervision = () =>
  import('./views/therapy-supervision/therapy-supervision').then((m) => m.TherapySupervision);

/**
 * Routes for the Therapy bounded context. The admin landing now focuses on
 * therapy sessions; exercise catalog management lives under `/exercises`.
 */
export const therapyRoutes: Routes = [
  { path: '', loadComponent: therapySupervision },
  { path: 'register', redirectTo: '/clinic-admin/exercises/new', pathMatch: 'full' },
];
