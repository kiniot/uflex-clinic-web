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

/**
 * Routes for the Organization bounded context. The default path is the
 * Organization page; physiotherapists/new mounts the physiotherapist registration
 * view alongside it.
 */
export const organizationRoutes: Routes = [
  { path: '', loadComponent: organizationManagement, data: { preload: true } },
  { path: 'physiotherapists/new', loadComponent: registerPhysiotherapist },
  { path: 'physiotherapists/:physiotherapistId', loadComponent: physiotherapistDetail },
  { path: 'patients/new', loadComponent: registerPatient, data: { roleContext: 'admin' } },
  { path: 'patients/:patientId', loadComponent: patientDetail, data: { roleContext: 'admin' } },
];
