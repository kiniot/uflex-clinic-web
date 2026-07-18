import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { PlanningStore } from '../../../application/planning.store';
import { TreatmentPlanWorkspace } from './treatment-plan-workspace';

describe('TreatmentPlanWorkspace', () => {
  const loadCurrentClinicOnce = vi.fn().mockResolvedValue(null);
  const loadCurrentPhysiotherapistOnce = vi.fn().mockResolvedValue(null);
  const loadPatientById = vi.fn().mockResolvedValue(null);
  const loadExerciseCatalog = vi.fn().mockResolvedValue([]);

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadCurrentPhysiotherapistOnce.mockClear();
    loadPatientById.mockClear();
    loadExerciseCatalog.mockClear();

    await TestBed.configureTestingModule({
      imports: [TreatmentPlanWorkspace, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ patientId: 'patient-1', planId: 'new' }),
              queryParamMap: convertToParamMap({ from: 'patient' }),
            },
            paramMap: of(convertToParamMap({ patientId: 'patient-1', planId: 'new' })),
            queryParamMap: of(convertToParamMap({ from: 'patient' })),
          },
        },
        {
          provide: OrganizationStore,
          useValue: {
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
            loadCurrentClinicOnce,
            loadCurrentPhysiotherapistOnce,
            loadPatientById,
          },
        },
        {
          provide: PlanningStore,
          useValue: {
            selectedTreatmentPlan: signal(null).asReadonly(),
            exerciseCatalog: signal([]).asReadonly(),
            isLoadingExerciseCatalog: signal(false).asReadonly(),
            exerciseCatalogError: signal(null).asReadonly(),
            isLoadingSelectedTreatmentPlan: signal(false).asReadonly(),
            loadExerciseCatalog,
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the back action to the patient detail view', () => {
    const fixture = TestBed.createComponent(TreatmentPlanWorkspace);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const hrefs = Array.from(anchors).map((anchor) => anchor.getAttribute('href') ?? '');

    expect(text).toContain('treatmentPlanWorkspace.actions.back');
    expect(hrefs.some((href) => href.includes('/physiotherapist/patients/patient-1'))).toBe(true);
  });
});
