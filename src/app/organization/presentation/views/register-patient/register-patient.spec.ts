import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { RegisterPatient } from './register-patient';
import { OrganizationStore } from '../../../application/organization.store';

describe('RegisterPatient', () => {
  const registerPatientSpy = vi.fn().mockResolvedValue({
    id: 'patient-1',
    fullName: 'Ignacio Mestanza',
  });

  beforeEach(async () => {
    registerPatientSpy.mockClear();

    await TestBed.configureTestingModule({
      imports: [RegisterPatient, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: OrganizationStore,
          useValue: {
            isRegisteringPatient: signal(false).asReadonly(),
            registerPatient: registerPatientSpy,
          },
        },
      ],
    }).compileComponents();
  });

  it('submits the form and navigates to the created patient detail', async () => {
    const fixture = TestBed.createComponent(RegisterPatient);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component['form'].setValue({
      firstName: 'Ignacio',
      lastName: 'Mestanza',
      dni: '72326004',
      birthDate: '2004-02-01',
      gender: 'MALE',
      email: 'patient@gmail.com',
      countryCode: '+51',
      phoneNumber: '958273817',
      medicalCondition: 'Forearm fracture',
    });

    component['onSubmit']();
    await fixture.whenStable();

    expect(registerPatientSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/physiotherapist/patients', 'patient-1']);
  });
});
