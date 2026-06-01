import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrganizationStore } from './organization.store';
import { OrganizationApi } from '../infrastructure/organization-api';

describe('OrganizationStore', () => {
  let store: OrganizationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationStore,
        {
          provide: OrganizationApi,
          useValue: {
            createClinic: () => of(null),
            getCurrentClinic: () => of(null),
            getCurrentPhysiotherapist: () => of(null),
            getMyPatients: () =>
              of([
                {
                  id: 'patient-1',
                  firstName: 'Ignacio',
                  lastName: 'Mestanza',
                  dni: '72326004',
                  birthDate: '2004-02-01',
                  gender: 'MALE',
                  email: 'ignacio@gmail.com',
                  countryCode: '+51',
                  phoneNumber: '958273817',
                  medicalCondition: 'Forearm fracture',
                  assignedPhysiotherapistId: 'physio-1',
                  status: 'IN_TREATMENT',
                  clinicId: 'clinic-1',
                },
                {
                  id: 'patient-2',
                  firstName: 'Mateo',
                  lastName: 'Salazar',
                  dni: '73124568',
                  birthDate: '1987-03-22',
                  gender: 'MALE',
                  email: 'mateo@gmail.com',
                  countryCode: '+51',
                  phoneNumber: '912345678',
                  medicalCondition: 'Shoulder mobility recovery',
                  assignedPhysiotherapistId: 'physio-1',
                  status: 'DISCHARGED',
                  clinicId: 'clinic-1',
                },
              ]),
            getPatientById: () => of(null),
            registerPatientAsPhysiotherapist: () => of(null),
            dischargePatient: () => of(void 0),
          },
        },
      ],
    });

    store = TestBed.inject(OrganizationStore);
  });

  it('computes patient status counters from the loaded caseload', async () => {
    await store.loadMyPatients();

    expect(store.patients().length).toBe(2);
    expect(store.inTreatmentPatientsCount()).toBe(1);
    expect(store.dischargedPatientsCount()).toBe(1);
    expect(store.registeredPatientsCount()).toBe(0);
  });
});
