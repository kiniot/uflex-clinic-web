import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { convertToParamMap, provideRouter, Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationStore } from '../../../application/organization.store';
import { PhysiotherapistDetail } from './physiotherapist-detail';

describe('PhysiotherapistDetail', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadClinicPhysiotherapists = vi.fn().mockResolvedValue([]);
  const loadClinicPhysiotherapistById = vi.fn().mockResolvedValue(null);
  const loadPatientsByPhysiotherapistId = vi.fn().mockResolvedValue([]);
  const assignPatient = vi.fn().mockResolvedValue(void 0);
  const updatePatientAsClinicAdmin = vi.fn().mockResolvedValue(null);
  const deletePatient = vi.fn().mockResolvedValue(void 0);
  const selectedPhysiotherapistSignal = signal({
    id: 'physio-1',
    fullName: 'Ignacio Mestanza',
    specialty: 'NEUROLOGICAL',
    countryCode: '+51',
    phoneNumber: '987654321',
    email: 'ignacio@example.com',
    licenseNumber: 'CPT12345',
    yearsOfExperience: 7,
    professionalSummary: 'Neuro specialist',
    hireDate: '2025-01-01',
    status: 'ACTIVE',
  });

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadClinicPhysiotherapists.mockClear();
    loadClinicPhysiotherapistById.mockClear();
    loadPatientsByPhysiotherapistId.mockClear();
    assignPatient.mockClear();
    updatePatientAsClinicAdmin.mockClear();
    deletePatient.mockClear();
    selectedPhysiotherapistSignal.set({
      id: 'physio-1',
      fullName: 'Ignacio Mestanza',
      specialty: 'NEUROLOGICAL',
      countryCode: '+51',
      phoneNumber: '987654321',
      email: 'ignacio@example.com',
      licenseNumber: 'CPT12345',
      yearsOfExperience: 7,
      professionalSummary: 'Neuro specialist',
      hireDate: '2025-01-01',
      status: 'ACTIVE',
    });

    await TestBed.configureTestingModule({
      imports: [PhysiotherapistDetail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ physiotherapistId: 'physio-1' })),
            snapshot: {
              paramMap: convertToParamMap({ physiotherapistId: 'physio-1' }),
            },
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
            currentClinic: signal({
              commercialName: 'uFlex Clinic',
              legalName: 'uFlex SAC',
            }).asReadonly(),
            selectedPhysiotherapist: selectedPhysiotherapistSignal.asReadonly(),
            physiotherapists: signal([]).asReadonly(),
            patientsByPhysiotherapist: signal([]).asReadonly(),
            isLoadingSelectedPhysiotherapist: signal(false).asReadonly(),
            isLoadingPatientsByPhysiotherapist: signal(false).asReadonly(),
            isAssigningPatient: signal(false).asReadonly(),
            isUpdatingPatient: signal(false).asReadonly(),
            isDeletingPatient: signal(false).asReadonly(),
            isUpdatingPhysiotherapist: signal(false).asReadonly(),
            isSuspendingPhysiotherapist: signal(false).asReadonly(),
            isReactivatingPhysiotherapist: signal(false).asReadonly(),
            isDeletingPhysiotherapist: signal(false).asReadonly(),
            loadCurrentClinicOnce,
            loadClinicPhysiotherapists,
            loadClinicPhysiotherapistById,
            loadPatientsByPhysiotherapistId,
            assignPatient,
            updatePatientAsClinicAdmin,
            deletePatient,
            updatePhysiotherapist: vi.fn(),
            suspendPhysiotherapist: vi.fn(),
            reactivatePhysiotherapist: vi.fn(),
            deletePhysiotherapist: vi.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the back action and the physiotherapists breadcrumb target', () => {
    const fixture = TestBed.createComponent(PhysiotherapistDetail);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((debugElement) => debugElement.injector.get(RouterLink));

    expect(text).toContain('organization.physiotherapistDetail.actions.back');
    expect(text).not.toContain('organization.physiotherapists.actions.register');
    expect(routerLinks.some((routerLink) => routerLink.queryParams?.['tab'] === 'physiotherapists')).toBe(true);
  });

  it('navigates back to the physiotherapists tab after delete succeeds', async () => {
    const fixture = TestBed.createComponent(PhysiotherapistDetail);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component['pendingAction'].set('delete');
    await component['confirmAction']();

    expect(navigateSpy).toHaveBeenCalledWith(['/clinic-admin/organization'], {
      queryParams: { tab: 'physiotherapists' },
    });
  });

  it('shows the suspend action when the physiotherapist is inactive', () => {
    selectedPhysiotherapistSignal.set({
      ...selectedPhysiotherapistSignal(),
      status: 'INACTIVE',
    });

    const fixture = TestBed.createComponent(PhysiotherapistDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'organization.physiotherapists.actions.suspend',
    );
  });
});
