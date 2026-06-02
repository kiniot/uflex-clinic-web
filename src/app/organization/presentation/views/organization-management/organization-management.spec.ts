import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationManagement } from './organization-management';
import { OrganizationStore } from '../../../application/organization.store';

describe('OrganizationManagement', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadCurrentClinicAdminOnce = vi.fn().mockResolvedValue(null);
  const loadClinicPhysiotherapists = vi.fn().mockResolvedValue([]);
  const loadClinicPatients = vi.fn().mockResolvedValue([]);
  const assignPatient = vi.fn().mockResolvedValue(void 0);

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadCurrentClinicAdminOnce.mockClear();
    loadClinicPhysiotherapists.mockClear();
    loadClinicPatients.mockClear();
    assignPatient.mockClear();

    await TestBed.configureTestingModule({
      imports: [OrganizationManagement, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: OrganizationStore,
          useValue: {
            currentClinic: signal({
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
            }).asReadonly(),
            currentClinicAdmin: signal({
              id: 'admin-1',
              firstName: 'Lucia',
              lastName: 'Ramos',
              fullName: 'Lucia Ramos',
              email: 'lucia@uflex.com',
            }).asReadonly(),
            physiotherapists: signal([
              {
                id: 'physio-1',
                fullName: 'Ignacio Mestanza',
                email: 'ignacio@gmail.com',
                countryCode: '+51',
                phoneNumber: '987654321',
                licenseNumber: 'CPT12345',
                yearsOfExperience: 7,
                specialty: 'NEUROLOGICAL',
                status: 'ACTIVE',
              },
            ]).asReadonly(),
            patients: signal([
              {
                id: 'patient-1',
                fullName: 'Mateo Salazar',
                email: 'mateo@gmail.com',
                dni: '73124568',
                medicalCondition: 'Shoulder mobility recovery',
                assignedPhysiotherapistId: 'physio-1',
                status: 'IN_TREATMENT',
                countryCode: '+51',
                phoneNumber: '987654321',
              },
              {
                id: 'patient-2',
                fullName: 'Lucia Rojas',
                email: 'lucia@gmail.com',
                dni: '74561238',
                medicalCondition: 'Wrist mobility recovery',
                assignedPhysiotherapistId: null,
                status: 'REGISTERED',
                countryCode: '+51',
                phoneNumber: '912345678',
              },
            ]).asReadonly(),
            isLoadingCurrentClinic: signal(false).asReadonly(),
            isLoadingCurrentClinicAdmin: signal(false).asReadonly(),
            isLoadingPhysiotherapists: signal(false).asReadonly(),
            isLoadingPatients: signal(false).asReadonly(),
            isAssigningPatient: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadCurrentClinicAdminOnce,
            loadClinicPhysiotherapists,
            loadClinicPatients,
            assignPatient,
          },
        },
      ],
    }).compileComponents();
  });

  it('renders clinic identity and real metrics', () => {
    const fixture = TestBed.createComponent(OrganizationManagement);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('uFlex Clinic');
    expect(text).toContain('uFlex SAC');
    expect(text).toContain('20123456789');
    expect(text).toContain('Lucia Ramos');
  });

  it('opens the assignment dialog from the patients table action', () => {
    const fixture = TestBed.createComponent(OrganizationManagement);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['onAssignPatient']({
      id: 'patient-2',
      fullName: 'Lucia Rojas',
      assignedPhysiotherapistId: null,
      medicalCondition: 'Wrist mobility recovery',
    } as never);

    expect(component['selectedPatientForAssignment']()?.id).toBe('patient-2');
  });
});
