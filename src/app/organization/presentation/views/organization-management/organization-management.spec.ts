import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationManagement } from './organization-management';
import { OrganizationStore } from '../../../application/organization.store';
import { By } from '@angular/platform-browser';

describe('OrganizationManagement', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadCurrentClinicAdminOnce = vi.fn().mockResolvedValue(null);
  const loadClinicPhysiotherapists = vi.fn().mockResolvedValue([]);
  const loadClinicPatients = vi.fn().mockResolvedValue([]);
  const assignPatient = vi.fn().mockResolvedValue(void 0);
  const updatePatientAsClinicAdmin = vi.fn().mockResolvedValue(null);
  const deletePatient = vi.fn().mockResolvedValue(void 0);
  const updatePhysiotherapist = vi.fn();
  const suspendPhysiotherapist = vi.fn();
  const reactivatePhysiotherapist = vi.fn();
  const deletePhysiotherapist = vi.fn();

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadCurrentClinicAdminOnce.mockClear();
    loadClinicPhysiotherapists.mockClear();
    loadClinicPatients.mockClear();
    assignPatient.mockClear();
    updatePatientAsClinicAdmin.mockClear();
    deletePatient.mockClear();
    updatePhysiotherapist.mockClear();
    suspendPhysiotherapist.mockClear();
    reactivatePhysiotherapist.mockClear();
    deletePhysiotherapist.mockClear();

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
              dni: '74839210',
              email: 'lucia@uflex.com',
              countryCode: '+51',
              phoneNumber: '999888777',
            }).asReadonly(),
            currentClinicAdminProfileStatus: signal('ready').asReadonly(),
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
            isUpdatingPatient: signal(false).asReadonly(),
            isDeletingPatient: signal(false).asReadonly(),
            isUpdatingPhysiotherapist: signal(false).asReadonly(),
            isSuspendingPhysiotherapist: signal(false).asReadonly(),
            isReactivatingPhysiotherapist: signal(false).asReadonly(),
            isDeletingPhysiotherapist: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadCurrentClinicAdminOnce,
            loadClinicPhysiotherapists,
            loadClinicPatients,
            assignPatient,
            updatePatientAsClinicAdmin,
            deletePatient,
            updatePhysiotherapist,
            suspendPhysiotherapist,
            reactivatePhysiotherapist,
            deletePhysiotherapist,
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
    expect(text).toContain('lucia@uflex.com');
    expect(text).toContain('+51 999888777');
    expect(text).toContain('74839210');
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

  it('shows the pending clinic admin state and navigates to profile', async () => {
    TestBed.resetTestingModule();

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
            currentClinicAdmin: signal(null).asReadonly(),
            currentClinicAdminProfileStatus: signal('missing').asReadonly(),
            physiotherapists: signal([]).asReadonly(),
            patients: signal([]).asReadonly(),
            isLoadingCurrentClinic: signal(false).asReadonly(),
            isLoadingCurrentClinicAdmin: signal(false).asReadonly(),
            isLoadingPhysiotherapists: signal(false).asReadonly(),
            isLoadingPatients: signal(false).asReadonly(),
            isAssigningPatient: signal(false).asReadonly(),
            isUpdatingPatient: signal(false).asReadonly(),
            isDeletingPatient: signal(false).asReadonly(),
            isUpdatingPhysiotherapist: signal(false).asReadonly(),
            isSuspendingPhysiotherapist: signal(false).asReadonly(),
            isReactivatingPhysiotherapist: signal(false).asReadonly(),
            isDeletingPhysiotherapist: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadCurrentClinicAdminOnce,
            loadClinicPhysiotherapists,
            loadClinicPatients,
            assignPatient,
            updatePatientAsClinicAdmin,
            deletePatient,
            updatePhysiotherapist,
            suspendPhysiotherapist,
            reactivatePhysiotherapist,
            deletePhysiotherapist,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrganizationManagement);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('organization.profile.empty.title');

    const button = fixture.debugElement
      .queryAll(By.css('button'))
      .find((debugElement) =>
        String((debugElement.nativeElement as HTMLButtonElement).textContent).includes(
          'organization.profile.empty.cta',
        ),
      );

    expect(button).toBeTruthy();

    button!.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/clinic-admin/profile']);
  });
});
