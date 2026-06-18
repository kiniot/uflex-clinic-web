import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { OrganizationStore } from './organization.store';
import { OrganizationApi } from '../infrastructure/organization-api';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';
import { UpdatePatientByClinicAdminCommand } from '../domain/model/update-patient-by-clinic-admin.command';
import { UpdatePhysiotherapistCommand } from '../domain/model/update-physiotherapist.command';
import { UpdatePatientContactCommand } from '../domain/model/update-patient-contact.command';

describe('OrganizationStore', () => {
  let store: OrganizationStore;
  const assignPatientSpy = vi.fn().mockReturnValue(of(void 0));
  const updatePhysiotherapistSpy = vi.fn();
  const suspendPhysiotherapistSpy = vi.fn();
  const reactivatePhysiotherapistSpy = vi.fn();
  const deletePhysiotherapistSpy = vi.fn();
  const getClinicPhysiotherapistsSpy = vi.fn();
  const getClinicPhysiotherapistByIdSpy = vi.fn();
  const getClinicPatientsSpy = vi.fn();
  const getPatientsByPhysiotherapistIdSpy = vi.fn();
  const getCurrentClinicAdminSpy = vi.fn();
  const registerClinicAdminSpy = vi.fn();
  const updatePatientByClinicAdminSpy = vi.fn();
  const updatePatientSpy = vi.fn().mockImplementation((id: string, command: UpdatePatientContactCommand) =>
    of({
      ...clinicPatients[0],
      id,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
    }),
  );
  const deletePatientSpy = vi.fn().mockReturnValue(of(void 0));
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
  let clinicPatientsState = [...clinicPatients];
  let clinicPhysiotherapistsState = [
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
  ];

  beforeEach(() => {
    assignPatientSpy.mockClear();
    updatePhysiotherapistSpy.mockClear();
    suspendPhysiotherapistSpy.mockClear();
    reactivatePhysiotherapistSpy.mockClear();
    deletePhysiotherapistSpy.mockClear();
    getClinicPhysiotherapistsSpy.mockClear();
    getClinicPhysiotherapistByIdSpy.mockClear();
    getClinicPatientsSpy.mockClear();
    getPatientsByPhysiotherapistIdSpy.mockClear();
    getCurrentClinicAdminSpy.mockClear();
    registerClinicAdminSpy.mockClear();
    updatePatientByClinicAdminSpy.mockClear();
    updatePatientSpy.mockClear();
    deletePatientSpy.mockClear();
    clinicPatientsState = clinicPatients.map((patient) => ({ ...patient }));
    clinicPhysiotherapistsState = [
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
    ];

    getClinicPhysiotherapistsSpy.mockImplementation(() =>
      of(clinicPhysiotherapistsState.map((physiotherapist) => ({ ...physiotherapist }))),
    );
    getClinicPhysiotherapistByIdSpy.mockImplementation((id: string) =>
      of({
        ...(clinicPhysiotherapistsState.find((physiotherapist) => physiotherapist.id === id) ??
          registeredPhysiotherapistResource),
      }),
    );
    getClinicPatientsSpy.mockImplementation(() =>
      of(clinicPatientsState.map((patient) => ({ ...patient }))),
    );
    getCurrentClinicAdminSpy.mockReturnValue(
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
    );
    registerClinicAdminSpy.mockImplementation((command) =>
      of({
        id: 'admin-1',
        firstName: command.firstName,
        lastName: command.lastName,
        dni: command.dni,
        birthDate: command.birthDate,
        gender: command.gender,
        email: 'salim@uflex.com',
        countryCode: command.countryCode,
        phoneNumber: command.phoneNumber,
        clinicId: 'clinic-1',
      }),
    );
    getPatientsByPhysiotherapistIdSpy.mockImplementation((physiotherapistId: string) =>
      of(
        clinicPatientsState
          .filter((patient) => patient.assignedPhysiotherapistId === physiotherapistId)
          .map((patient) => ({ ...patient })),
      ),
    );
    updatePhysiotherapistSpy.mockImplementation(
      (id: string, command: UpdatePhysiotherapistCommand) => {
        const index = clinicPhysiotherapistsState.findIndex(
          (physiotherapist) => physiotherapist.id === id,
        );
        const current = clinicPhysiotherapistsState[index]!;
        const updated = {
          ...current,
          fullName: command.fullName,
          specialty: command.specialty,
          email: command.email,
          countryCode: command.countryCode,
          phoneNumber: command.phoneNumber,
          licenseNumber: command.licenseNumber,
          professionalSummary: command.professionalSummary,
          photoUrl: command.photoUrl,
          yearsOfExperience: command.yearsOfExperience,
        };
        clinicPhysiotherapistsState[index] = updated;
        return of({ ...updated });
      },
    );
    suspendPhysiotherapistSpy.mockImplementation((id: string) => {
      clinicPhysiotherapistsState = clinicPhysiotherapistsState.map((physiotherapist) =>
        physiotherapist.id === id ? { ...physiotherapist, status: 'SUSPENDED' } : physiotherapist,
      );
      clinicPatientsState = clinicPatientsState.map((patient) =>
        patient.assignedPhysiotherapistId === id
          ? { ...patient, assignedPhysiotherapistId: null }
          : patient,
      );
      return of(void 0);
    });
    reactivatePhysiotherapistSpy.mockImplementation((id: string) => {
      clinicPhysiotherapistsState = clinicPhysiotherapistsState.map((physiotherapist) =>
        physiotherapist.id === id ? { ...physiotherapist, status: 'ACTIVE' } : physiotherapist,
      );
      return of(void 0);
    });
    deletePhysiotherapistSpy.mockImplementation((id: string) => {
      clinicPhysiotherapistsState = clinicPhysiotherapistsState.filter(
        (physiotherapist) => physiotherapist.id !== id,
      );
      return of(void 0);
    });
    updatePatientByClinicAdminSpy.mockImplementation(
      (id: string, command: UpdatePatientByClinicAdminCommand) => {
        const index = clinicPatientsState.findIndex((patient) => patient.id === id);
        const current = clinicPatientsState[index]!;
        const updated = {
          ...current,
          firstName: command.firstName,
          lastName: command.lastName,
          dni: command.dni,
          birthDate: command.birthDate,
          gender: command.gender,
          email: command.email,
          countryCode: command.countryCode,
          phoneNumber: command.phoneNumber,
          medicalCondition: command.medicalCondition,
          assignedPhysiotherapistId: command.assignedPhysiotherapistId,
        };
        clinicPatientsState[index] = updated;
        return of({ ...updated });
      },
    );

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
            getCurrentClinicAdmin: getCurrentClinicAdminSpy,
            registerClinicAdmin: registerClinicAdminSpy,
            getClinicPhysiotherapists: getClinicPhysiotherapistsSpy,
            getClinicPhysiotherapistById: getClinicPhysiotherapistByIdSpy,
            registerPhysiotherapistAsClinicAdmin: () => of(registeredPhysiotherapistResource),
            updatePhysiotherapist: updatePhysiotherapistSpy,
            suspendPhysiotherapist: suspendPhysiotherapistSpy,
            reactivatePhysiotherapist: reactivatePhysiotherapistSpy,
            deletePhysiotherapist: deletePhysiotherapistSpy,
            getClinicPatients: getClinicPatientsSpy,
            getClinicPatientsByClinicId: () => of(clinicPatients),
            getPatientsByPhysiotherapistId: getPatientsByPhysiotherapistIdSpy,
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
            updatePatientAsClinicAdmin: updatePatientByClinicAdminSpy,
            updatePatientAsPhysiotherapist: updatePatientSpy,
            deletePatient: deletePatientSpy,
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
    expect(store.currentClinicAdminProfileStatus()).toBe('ready');
  });

  it('treats a missing clinic admin profile as a non-fatal empty state', async () => {
    getCurrentClinicAdminSpy.mockReturnValueOnce(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            error: { code: 'NOT_FOUND', status: 404 },
          }),
      ),
    );

    const admin = await store.loadCurrentClinicAdminOnce({ force: true });

    expect(admin).toBeNull();
    expect(store.currentClinicAdmin()).toBeNull();
    expect(store.currentClinicAdminProfileStatus()).toBe('missing');
  });

  it('creates the clinic admin profile and syncs the ready state', async () => {
    const admin = await store.registerClinicAdminProfile({
      firstName: 'Salim',
      lastName: 'Ramirez',
      dni: '74839210',
      birthDate: '1990-01-01',
      gender: 'MALE',
      countryCode: '+51',
      phoneNumber: '999888777',
    } as never);

    expect(registerClinicAdminSpy).toHaveBeenCalled();
    expect(admin.fullName).toBe('Salim Ramirez');
    expect(store.currentClinicAdminProfileStatus()).toBe('ready');
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

  it('updates physiotherapists in both the collection and selected detail state', async () => {
    await store.loadClinicPhysiotherapists();
    await store.loadClinicPhysiotherapistById('physio-1');

    const updated = await store.updatePhysiotherapist(
      'physio-1',
      new UpdatePhysiotherapistCommand({
        fullName: 'Ignacio Actualizado',
        specialty: 'SPORTS',
        email: 'ignacio.actualizado@example.com',
        countryCode: '+51',
        phoneNumber: '999888777',
        licenseNumber: 'CPT99999',
        professionalSummary: 'Updated summary',
        photoUrl: 'https://example.com/photo.jpg',
        yearsOfExperience: 11,
      }),
    );

    expect(updatePhysiotherapistSpy).toHaveBeenCalledTimes(1);
    expect(updated.fullName).toBe('Ignacio Actualizado');
    expect(store.physiotherapists()[0]?.fullName).toBe('Ignacio Actualizado');
    expect(store.selectedPhysiotherapist()?.email).toBe('ignacio.actualizado@example.com');
  });

  it('suspends physiotherapists and refreshes their assigned patients', async () => {
    await store.loadClinicPhysiotherapists();
    await store.loadClinicPhysiotherapistById('physio-1');
    await store.loadClinicPatients();
    await store.loadPatientsByPhysiotherapistId('physio-1');

    await store.suspendPhysiotherapist('physio-1');

    expect(suspendPhysiotherapistSpy).toHaveBeenCalledTimes(1);
    expect(store.physiotherapists()[0]?.status).toBe('SUSPENDED');
    expect(store.selectedPhysiotherapist()?.status).toBe('SUSPENDED');
    expect(store.patients()[0]?.assignedPhysiotherapistId).toBeNull();
    expect(store.patientsByPhysiotherapist()).toHaveLength(0);
  });

  it('reactivates suspended physiotherapists and refreshes detail state', async () => {
    clinicPhysiotherapistsState = clinicPhysiotherapistsState.map((physiotherapist) => ({
      ...physiotherapist,
      status: 'SUSPENDED',
    }));

    await store.loadClinicPhysiotherapists();
    await store.loadClinicPhysiotherapistById('physio-1');

    await store.reactivatePhysiotherapist('physio-1');

    expect(reactivatePhysiotherapistSpy).toHaveBeenCalledTimes(1);
    expect(store.physiotherapists()[0]?.status).toBe('ACTIVE');
    expect(store.selectedPhysiotherapist()?.status).toBe('ACTIVE');
  });

  it('deletes physiotherapists and clears the active detail state when needed', async () => {
    await store.loadClinicPhysiotherapists();
    await store.loadClinicPhysiotherapistById('physio-1');
    await store.loadPatientsByPhysiotherapistId('physio-1');

    await store.deletePhysiotherapist('physio-1');

    expect(deletePhysiotherapistSpy).toHaveBeenCalledTimes(1);
    expect(store.physiotherapists()).toHaveLength(0);
    expect(store.selectedPhysiotherapist()).toBeNull();
    expect(store.patientsByPhysiotherapist()).toHaveLength(0);
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

  it('updates patient contact data for the physiotherapist flow', async () => {
    await store.loadMyPatients();

    const patient = await store.updatePatientAsPhysiotherapist(
      'patient-1',
      new UpdatePatientContactCommand({
        firstName: 'Mateo',
        lastName: 'Salazar',
        email: 'lucia.updated@example.com',
        countryCode: '+51',
        phoneNumber: '998887766',
        medicalCondition: 'Shoulder mobility recovery - progression phase',
      }),
    );

    expect(patient.email).toBe('lucia.updated@example.com');
    expect(store.patients()[0]?.phoneNumber).toBe('998887766');
  });

  it('updates patient data for the clinic-admin flow and preserves assignment state', async () => {
    await store.loadClinicPatients();
    await store.loadPatientById('patient-1');
    await store.loadPatientsByPhysiotherapistId('physio-1');

    const patient = await store.updatePatientAsClinicAdmin(
      'patient-1',
      new UpdatePatientByClinicAdminCommand({
        firstName: 'Lucia',
        lastName: 'Actualizada',
        dni: '74839210',
        birthDate: '1992-08-14',
        gender: 'FEMALE',
        email: 'lucia.updated@example.com',
        countryCode: '+51',
        phoneNumber: '999888777',
        medicalCondition: 'Updated condition',
        assignedPhysiotherapistId: 'physio-1',
      }),
    );

    expect(updatePatientByClinicAdminSpy).toHaveBeenCalledTimes(1);
    expect(patient.lastName).toBe('Actualizada');
    expect(patient.assignedPhysiotherapistId).toBe('physio-1');
    expect(store.selectedPatient()?.email).toBe('lucia.updated@example.com');
    expect(store.patients()[0]?.assignedPhysiotherapistId).toBe('physio-1');
  });

  it('deletes patients from the physiotherapist collections', async () => {
    await store.loadMyPatients();

    await store.deletePatient('patient-1');

    expect(store.patients().some((patient) => patient.id === 'patient-1')).toBe(false);
  });
});
