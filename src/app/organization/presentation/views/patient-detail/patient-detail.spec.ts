import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  convertToParamMap,
  ActivatedRoute,
  provideRouter,
  Router,
  RouterLink,
} from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PatientDetail } from './patient-detail';
import { OrganizationStore } from '../../../application/organization.store';
import { PlanningStore } from '../../../../planning/application/planning.store';

describe('PatientDetail', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadClinicPhysiotherapists = vi.fn().mockResolvedValue([]);
  const loadPatientById = vi.fn().mockResolvedValue(null);
  const loadTreatmentPlansByPatient = vi.fn().mockResolvedValue([]);
  const assignPatient = vi.fn().mockResolvedValue(void 0);
  const updatePatientAsClinicAdmin = vi.fn().mockResolvedValue(null);
  const updatePatientAsPhysiotherapist = vi.fn().mockResolvedValue(null);
  const deletePatient = vi.fn().mockResolvedValue(void 0);

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadClinicPhysiotherapists.mockClear();
    loadPatientById.mockClear();
    loadTreatmentPlansByPatient.mockClear();
    assignPatient.mockClear();
    updatePatientAsClinicAdmin.mockClear();
    updatePatientAsPhysiotherapist.mockClear();
    deletePatient.mockClear();

    await TestBed.configureTestingModule({
      imports: [PatientDetail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { roleContext: 'admin' },
              paramMap: convertToParamMap({ patientId: 'patient-1' }),
            },
            paramMap: of(convertToParamMap({ patientId: 'patient-1' })),
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            currentClinic: signal({
              id: 'clinic-1',
              commercialName: 'uFlex Clinic',
              legalName: 'uFlex SAC',
            }).asReadonly(),
            selectedPatient: signal({
              id: 'patient-1',
              fullName: 'Lucia Ramos',
              medicalCondition: 'Knee rehab',
              status: 'REGISTERED',
              dni: '74839210',
              gender: 'FEMALE',
              birthDate: '1992-08-14',
              email: 'lucia@example.com',
              countryCode: '+51',
              phoneNumber: '987654321',
              assignedPhysiotherapistId: null,
              clinicId: 'clinic-1',
            }).asReadonly(),
            currentPhysiotherapist: signal(null).asReadonly(),
            physiotherapists: signal([
              {
                id: 'physio-1',
                fullName: 'Pepito Perez',
                specialty: 'GENERAL',
                email: 'physio@example.com',
                countryCode: '+51',
                phoneNumber: '999888777',
                licenseNumber: 'CPT12345',
                professionalSummary: null,
                photoUrl: null,
                yearsOfExperience: 10,
                hireDate: '2026-01-01',
                status: 'ACTIVE',
                clinicId: 'clinic-1',
                userId: 'user-1',
              },
            ]).asReadonly(),
            isLoadingSelectedPatient: signal(false).asReadonly(),
            isDischargingPatient: signal(false).asReadonly(),
            isAssigningPatient: signal(false).asReadonly(),
            isUpdatingPatient: signal(false).asReadonly(),
            isDeletingPatient: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadClinicPhysiotherapists,
            loadPatientById,
            assignPatient,
            updatePatientAsClinicAdmin,
            updatePatientAsPhysiotherapist,
            deletePatient,
          },
        },
        {
          provide: PlanningStore,
          useValue: {
            patientTreatmentPlans: signal([]).asReadonly(),
            isLoadingTreatmentPlans: signal(false).asReadonly(),
            loadTreatmentPlansByPatient,
          },
        },
      ],
    }).compileComponents();
  });

  it('shows unassigned state and opens the assignment dialog in admin context', () => {
    const fixture = TestBed.createComponent(PatientDetail);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('organization.patients.unassigned');
    expect(fixture.nativeElement.textContent).toContain('organization.patients.actions.assign');

    component['openAssignmentDialog']();
    fixture.detectChanges();

    expect(component['isAssignmentDialogVisible']()).toBe(true);
  });

  it('renders clickable organization and patients breadcrumbs plus the back action', () => {
    const fixture = TestBed.createComponent(PatientDetail);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((debugElement) => debugElement.injector.get(RouterLink));

    expect(text).toContain('organization.breadcrumb.organization');
    expect(text).toContain('organization.tabs.patients');
    expect(text).toContain('organization.patientDetail.actions.back');
    expect(routerLinks.some((routerLink) => routerLink.queryParams?.['tab'] === 'patients')).toBe(
      true,
    );
  });

  it('navigates back to the admin patients tab after delete succeeds', async () => {
    const fixture = TestBed.createComponent(PatientDetail);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    component['openDeletePatientDialog']();
    await component['confirmDeletePatient']();

    expect(deletePatient).toHaveBeenCalledWith('patient-1');
    expect(navigateSpy).toHaveBeenCalledWith(['/clinic-admin/organization'], {
      queryParams: { tab: 'patients' },
    });
  });
});

describe('PatientDetail physiotherapist context', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadCurrentPhysiotherapistOnce = vi.fn().mockResolvedValue(null);
  const loadPatientById = vi.fn().mockResolvedValue(null);
  const loadTreatmentPlansByPatient = vi.fn().mockResolvedValue([]);

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadCurrentPhysiotherapistOnce.mockClear();
    loadPatientById.mockClear();
    loadTreatmentPlansByPatient.mockClear();

    await TestBed.configureTestingModule({
      imports: [PatientDetail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { roleContext: 'physiotherapist' },
              paramMap: convertToParamMap({ patientId: 'patient-1' }),
            },
            paramMap: of(convertToParamMap({ patientId: 'patient-1' })),
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            currentClinic: signal({
              id: 'clinic-1',
              commercialName: 'uFlex Clinic',
              legalName: 'uFlex SAC',
            }).asReadonly(),
            selectedPatient: signal({
              id: 'patient-1',
              fullName: 'Lucia Ramos',
              medicalCondition: 'Knee rehab',
              status: 'IN_TREATMENT',
              dni: '74839210',
              gender: 'FEMALE',
              birthDate: '1992-08-14',
              email: 'lucia@example.com',
              countryCode: '+51',
              phoneNumber: '987654321',
              assignedPhysiotherapistId: 'physio-1',
              clinicId: 'clinic-1',
            }).asReadonly(),
            currentPhysiotherapist: signal({
              id: 'physio-1',
              fullName: 'Pepito Perez',
              specialty: 'GENERAL',
              email: 'physio@example.com',
              countryCode: '+51',
              phoneNumber: '999888777',
              licenseNumber: 'CPT12345',
              professionalSummary: null,
              photoUrl: null,
              yearsOfExperience: 10,
              hireDate: '2026-01-01',
              status: 'ACTIVE',
              clinicId: 'clinic-1',
              userId: 'user-1',
            }).asReadonly(),
            physiotherapists: signal([]).asReadonly(),
            isLoadingSelectedPatient: signal(false).asReadonly(),
            isDischargingPatient: signal(false).asReadonly(),
            isAssigningPatient: signal(false).asReadonly(),
            isUpdatingPatient: signal(false).asReadonly(),
            isDeletingPatient: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadCurrentPhysiotherapistOnce,
            loadPatientById,
            dischargePatient: vi.fn().mockResolvedValue(void 0),
            updatePatientAsPhysiotherapist: vi.fn().mockResolvedValue(null),
            deletePatient: vi.fn().mockResolvedValue(void 0),
          },
        },
        {
          provide: PlanningStore,
          useValue: {
            patientTreatmentPlans: signal([]).asReadonly(),
            isLoadingTreatmentPlans: signal(false).asReadonly(),
            loadTreatmentPlansByPatient,
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the back action to the physiotherapist patients hub', () => {
    const fixture = TestBed.createComponent(PatientDetail);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const hrefs = Array.from(anchors).map((anchor) => anchor.getAttribute('href') ?? '');

    expect(text).toContain('patientDetail.actions.back');
    expect(text).toContain('patientDetail.dischargePatient');
    expect(hrefs.some((href) => href.includes('/physiotherapist/patients'))).toBe(true);
  });
});
