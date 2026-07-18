import { Routes } from '@angular/router';

const patientsHub = () => import('./views/patients-hub/patients-hub').then((m) => m.PatientsHub);
const registerPatient = () =>
  import('./views/register-patient/register-patient').then((m) => m.RegisterPatient);
const patientDetail = () =>
  import('./views/patient-detail/patient-detail').then((m) => m.PatientDetail);

/**
 * Organization routes for the physiotherapist role. Only the public
 * patients URLs live here; the treatment-plan workspace now mounts
 * under the Planning bounded context (/physiotherapist/planning).
 */
export const physiotherapistOrganizationRoutes: Routes = [
  { path: '', loadComponent: patientsHub },
  { path: 'new', loadComponent: registerPatient, data: { roleContext: 'physiotherapist' } },
  {
    path: ':patientId',
    loadComponent: patientDetail,
    data: { roleContext: 'physiotherapist' },
  },
];
