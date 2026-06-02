import { Routes } from '@angular/router';

const organizationManagement = () =>
  import('./views/organization-management/organization-management').then(
    (m) => m.OrganizationManagement,
  );
const registerPhysiotherapist = () =>
  import('./views/register-physiotherapist/register-physiotherapist').then(
    (m) => m.RegisterPhysiotherapist,
  );
const physiotherapistDetail = () =>
  import('./views/physiotherapist-detail/physiotherapist-detail').then(
    (m) => m.PhysiotherapistDetail,
  );
const registerPatient = () =>
  import('./views/register-patient/register-patient').then((m) => m.RegisterPatient);
const patientDetail = () =>
  import('./views/patient-detail/patient-detail').then((m) => m.PatientDetail);
const patientTreatmentPlanRoutes = () =>
  import('../../planning/presentation/patient-treatment-plan.routes').then(
    (m) => m.patientTreatmentPlanRoutes,
  );

/**
 * Routes for the Organization bounded context. The default path is the
 * Organization page; staff/new mounts the physiotherapist registration
 * view alongside it.
 */
export const organizationRoutes: Routes = [
  { path: '', loadComponent: organizationManagement },
  { path: 'staff/new', loadComponent: registerPhysiotherapist },
  { path: 'staff/:physiotherapistId', loadComponent: physiotherapistDetail },
  { path: 'patients/new', loadComponent: registerPatient, data: { roleContext: 'admin' } },
  { path: 'patients/:patientId/treatment-plans', loadChildren: patientTreatmentPlanRoutes },
  { path: 'patients/:patientId', loadComponent: patientDetail, data: { roleContext: 'admin' } },
];
