import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrganizationStore } from './organization.store';
import { OrganizationApi } from '../infrastructure/organization-api';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';

describe('OrganizationStore', () => {
  let store: OrganizationStore;
  const assignPatientSpy = vi.fn().mockReturnValue(of(void 0));
  const clinicPatients = [
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
      assignedPhysiotherapistId: null,
      status: 'REGISTERED',
      clinicId: 'clinic-1',
    },
  ];
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
    assignedPhysiotherapistId: null,
    status: 'REGISTERED',
    clinicId: 'clinic-1',
  };
  const registeredPatientAssignedResource = {
    ...registeredPatientResource,
    id: 'patient-4',
    assignedPhysiotherapistId: 'physio-1',
  };
  const registeredPhysiotherapistResource = {
    id: 'physio-2',
    userId: 'user-2',
    clinicId: 'clinic-1',
    fullName: 'Lucia Ramos',
    specialty: 'GENERAL',
    email: 'lucia.ramos@example.com',
    countryCode: '+51',
    phoneNumber: '987654321',
    licenseNumber: 'CPT12345',
    professionalSummary: 'General physiotherapist',
    photoUrl: '',
    yearsOfExperience: 4,
    hireDate: '2026-06-01',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    assignPatientSpy.mockClear();

    TestBed.configureTestingModule({
      providers: [
        OrganizationStore,
        {
          provide: OrganizationApi,
          useValue: {
            createClinic: () => of(null),
            getCurrentClinic: () =>
              of({
                id: 'clinic-1',
                legalName: 'uFlex SAC',
                commercialName: 'uFlex Clinic',
                ruc: '20123456789',
                email: 'clinic@uflex.com',
                countryCode: '+51',
                phoneNumber: '999888777',
                address: {
                  countryCode: 'PE',
                  region: 'Lima',
                  city: 'Lima',
                  addressLine1: 'Av. Central 123',
                  addressLine2: null,
                  postalCode: null,
                },
              }),
            getCurrentClinicAdmin: () =>
              of({
                id: 'admin-1',
                firstName: 'Salim',
                lastName: 'Ramirez',
                dni: '74839210',
                birthDate: '1990-01-01',
                gender: 'MALE',
                email: 'salim@uflex.com',
                countryCode: '+51',
                phoneNumber: '999888777',
                clinicId: 'clinic-1',
              }),
            getClinicPhysiotherapists: () =>
              of([
                {
                  id: 'physio-1',
                  userId: 'user-1',
                  clinicId: 'clinic-1',
                  fullName: 'Ignacio Mestanza',
                  specialty: 'NEUROLOGICAL',
                  email: 'ignacio@gmail.com',
                  countryCode: '+51',
                  phoneNumber: '958273817',
                  licenseNumber: 'CPT12345',
                  professionalSummary: 'Neuro specialist',
                  photoUrl: '',
                  yearsOfExperience: 7,
                  hireDate: '2025-01-01',
                  status: 'ACTIVE',
                },
              ]),
            getClinicPhysiotherapistById: () => of(registeredPhysiotherapistResource),
            registerPhysiotherapistAsClinicAdmin: () => of(registeredPhysiotherapistResource),
            getClinicPatients: () => of(clinicPatients),
            getClinicPatientsByClinicId: () => of(clinicPatients),
            getPatientsByPhysiotherapistId: () =>
              of(
                clinicPatients.filter(
                  (patient) => patient.assignedPhysiotherapistId === 'physio-1',
                ),
              ),
            registerPatientAsClinicAdmin: (command: RegisterPatientCommand) =>
              of(
                command.assignedPhysiotherapistId
                  ? registeredPatientAssignedResource
                  : registeredPatientResource,
              ),
            assignPatient: assignPatientSpy,
            getCurrentPhysiotherapist: () =>
              of({
                id: 'physio-1',
                userId: 'user-1',
                clinicId: 'clinic-1',
                fullName: 'Ignacio Mestanza',
                specialty: 'NEUROLOGICAL',
                email: 'ignacio@gmail.com',
                countryCode: '+51',
                phoneNumber: '958273817',
                licenseNumber: 'CPT12345',
                professionalSummary: 'Neuro specialist',
                photoUrl: '',
                yearsOfExperience: 7,
                hireDate: '2025-01-01',
                status: 'ACTIVE',
              }),
            getMyPatients: () => of(clinicPatients),
            getPatientById: () => of(clinicPatients[0]),
            registerPatientAsPhysiotherapist: () => of(registeredPatientAssignedResource),
            dischargePatient: () => of(void 0),
          },
        },
      ],
    });

    store = TestBed.inject(OrganizationStore);
  });

  it('loads the current clinic admin profile', async () => {
    const admin = await store.loadCurrentClinicAdminOnce();

    expect(admin?.id).toBe('admin-1');
    expect(store.currentClinicAdmin()?.fullName).toBe('Salim Ramirez');
  });

  it('loads clinic physiotherapists for the admin flow', async () => {
    await store.loadClinicPhysiotherapists();

    expect(store.physiotherapists().length).toBe(1);
    expect(store.physiotherapists()[0]?.id).toBe('physio-1');
  });

  it('loads clinic patients from the canonical admin endpoint', async () => {
    await store.loadClinicPatients();

    expect(store.patients().length).toBe(2);
    expect(store.inTreatmentPatientsCount()).toBe(1);
    expect(store.registeredPatientsCount()).toBe(1);
  });

  it('loads patients by physiotherapist id', async () => {
    await store.loadPatientsByPhysiotherapistId('physio-1');

    expect(store.patientsByPhysiotherapist().length).toBe(1);
    expect(store.patientsByPhysiotherapist()[0]?.assignedPhysiotherapistId).toBe('physio-1');
  });

  it('prepends a newly registered physiotherapist to the collection', async () => {
    await store.loadClinicPhysiotherapists();

    const physiotherapist = await store.registerPhysiotherapistAsClinicAdmin(
      new RegisterPhysiotherapistCommand({
        fullName: 'Lucia Ramos',
        specialty: 'GENERAL',
        email: 'lucia.ramos@example.com',
        countryCode: '+51',
        phoneNumber: '987654321',
        licenseNumber: 'CPT12345',
        professionalSummary: 'General physiotherapist',
        photoUrl: '',
        yearsOfExperience: 4,
      }),
    );

    expect(physiotherapist.id).toBe('physio-2');
    expect(store.physiotherapists()[0]?.id).toBe('physio-2');
  });

  it('registers clinic patients with nullable physiotherapist assignments', async () => {
    await store.loadClinicPatients();

    const patient = await store.registerPatientAsClinicAdmin(
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

    expect(patient.assignedPhysiotherapistId).toBeNull();
    expect(store.patients()[0]?.id).toBe('patient-3');
  });

  it('registers clinic patients with an initial physiotherapist assignment', async () => {
    const patient = await store.registerPatientAsClinicAdmin(
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
        assignedPhysiotherapistId: 'physio-1',
      }),
    );

    expect(patient.assignedPhysiotherapistId).toBe('physio-1');
  });

  it('assigns a patient and updates collection state', async () => {
    await store.loadClinicPatients();
    await store.loadPatientById('patient-2');
    await store.loadPatientsByPhysiotherapistId('physio-1');

    await store.assignPatient(
      'patient-2',
      new AssignPatientCommand({ physiotherapistId: 'physio-1' }),
    );

    expect(assignPatientSpy).toHaveBeenCalledTimes(1);
    expect(
      store.patients().find((patient) => patient.id === 'patient-2')?.assignedPhysiotherapistId,
    ).toBe('physio-1');
    expect(store.selectedPatient()?.assignedPhysiotherapistId).toBe('physio-1');
    expect(store.patientsByPhysiotherapist().some((patient) => patient.id === 'patient-2')).toBe(
      true,
    );
  });

  it('preserves the physiotherapist patient flow and discharge updates', async () => {
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
        assignedPhysiotherapistId: 'physio-1',
      }),
    );

    expect(patient.id).toBe('patient-4');
    await store.dischargePatient('patient-1');

    expect(
      store.patients().find((currentPatient) => currentPatient.id === 'patient-1')?.status,
    ).toBe('DISCHARGED');
  });
});
