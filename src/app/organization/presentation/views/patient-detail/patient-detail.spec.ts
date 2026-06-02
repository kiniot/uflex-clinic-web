import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, provideRouter } from '@angular/router';
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

  beforeEach(async () => {
    loadCurrentClinicOnce.mockClear();
    loadClinicPhysiotherapists.mockClear();
    loadPatientById.mockClear();
    loadTreatmentPlansByPatient.mockClear();
    assignPatient.mockClear();

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
            loadCurrentClinicOnce,
            loadClinicPhysiotherapists,
            loadPatientById,
            assignPatient,
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
});
