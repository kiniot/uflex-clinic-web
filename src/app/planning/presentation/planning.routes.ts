import { Routes } from '@angular/router';

const planningHub = () => import('./views/planning-hub/planning-hub').then((m) => m.PlanningHub);
const patientTreatmentPlanRoutes = () =>
  import('./patient-treatment-plan.routes').then((m) => m.patientTreatmentPlanRoutes);

/**
 * Routes for the Planning bounded context. The index lists every
 * treatment plan across the physiotherapist's caseload; opening one
 * mounts the treatment-plan workspace under the same context.
 */
export const planningRoutes: Routes = [
  { path: '', loadComponent: planningHub },
  { path: ':patientId/treatment-plans', loadChildren: patientTreatmentPlanRoutes },
];
