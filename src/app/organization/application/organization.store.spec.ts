import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrganizationStore } from './organization.store';
import { OrganizationApi } from '../infrastructure/organization-api';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';

describe('OrganizationStore', () => {
  let store: OrganizationStore;
  const registeredPatientResource = {
    id: 'patient-3',
    firstName: 'Lucia',
    lastName: 'Rojas',
    dni: '74561238',
    birthDate: '1996-04-13',
    gender: 'FEMALE',
    email: 'lucia@gmail.com',
    countryCode: '+51',
    phoneNumber: '987123456',
    medicalCondition: 'Wrist mobility recovery',
    assignedPhysiotherapistId: 'physio-1',
    status: 'REGISTERED',
    clinicId: 'clinic-1',
  };

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
            registerPatientAsPhysiotherapist: () => of(registeredPatientResource),
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

  it('prepends a newly registered patient to the current caseload', async () => {
    await store.loadMyPatients();

    const patient = await store.registerPatient(
      new RegisterPatientCommand({
        firstName: 'Lucia',
        lastName: 'Rojas',
        dni: '74561238',
        birthDate: '1996-04-13',
        gender: 'FEMALE',
        email: 'lucia@gmail.com',
        countryCode: '+51',
        phoneNumber: '987123456',
        medicalCondition: 'Wrist mobility recovery',
      }),
    );

    expect(patient.id).toBe('patient-3');
    expect(store.patients()[0]?.id).toBe('patient-3');
    expect(store.registeredPatientsCount()).toBe(1);
  });
});
