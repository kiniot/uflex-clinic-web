import { Routes } from '@angular/router';

const treatmentPlanWorkspace = () =>
  import('./views/treatment-plan-workspace/treatment-plan-workspace').then(
    (m) => m.TreatmentPlanWorkspace,
  );

export const patientTreatmentPlanRoutes: Routes = [
  { path: ':planId', loadComponent: treatmentPlanWorkspace },
];
