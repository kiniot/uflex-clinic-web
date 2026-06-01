import { Routes } from '@angular/router';

const patientsHub = () => import('./views/patients-hub/patients-hub').then((m) => m.PatientsHub);
const registerPatient = () =>
  import('./views/register-patient/register-patient').then((m) => m.RegisterPatient);
const patientDetail = () =>
  import('./views/patient-detail/patient-detail').then((m) => m.PatientDetail);
const patientTreatmentPlanRoutes = () =>
  import('../../planning/presentation/patient-treatment-plan.routes').then(
    (m) => m.patientTreatmentPlanRoutes,
  );

/**
 * Organization routes for the physiotherapist role. The public
 * patients URLs live here, while treatment-plan internals lazy-load
 * from the Planning bounded context.
 */
export const physiotherapistOrganizationRoutes: Routes = [
  { path: '', loadComponent: patientsHub },
  { path: 'new', loadComponent: registerPatient },
  {
    path: ':patientId/treatment-plans',
    loadChildren: patientTreatmentPlanRoutes,
  },
  {
    path: ':patientId',
    loadComponent: patientDetail,
  },
];
