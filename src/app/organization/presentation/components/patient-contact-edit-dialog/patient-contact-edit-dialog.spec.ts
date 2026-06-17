import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Patient } from '../../../domain/model/patient.entity';
import { PatientContactEditDialog } from './patient-contact-edit-dialog';

describe('PatientContactEditDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientContactEditDialog, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('keeps the selected country code after the dialog has initialized the form', () => {
    const fixture = TestBed.createComponent(PatientContactEditDialog);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('patient', {
      id: 'patient-1',
      firstName: 'Lucia',
      lastName: 'Ramos',
      fullName: 'Lucia Ramos',
      dni: '74839210',
      birthDate: '1992-08-14',
      gender: 'FEMALE',
      email: 'lucia@example.com',
      countryCode: '+51',
      phoneNumber: '987654321',
      medicalCondition: 'Knee rehab',
      status: 'REGISTERED',
      clinicId: 'clinic-1',
      assignedPhysiotherapistId: null,
    } as unknown as Patient);
    fixture.componentRef.setInput('pending', false);

    fixture.detectChanges();

    component['form'].controls.countryCode.setValue('+56');
    fixture.detectChanges();

    expect(component['form'].controls.countryCode.value).toBe('+56');
    expect(component['countryPhoneOption'](component['form'].controls.countryCode.value)?.label).toBe(
      'countries.chile',
    );
  });

  it('does not reset the selected country code while the same dialog session stays open', () => {
    const fixture = TestBed.createComponent(PatientContactEditDialog);
    const component = fixture.componentInstance;
    const patient = {
      id: 'patient-1',
      firstName: 'Lucia',
      lastName: 'Ramos',
      fullName: 'Lucia Ramos',
      dni: '74839210',
      birthDate: '1992-08-14',
      gender: 'FEMALE',
      email: 'lucia@example.com',
      countryCode: '+51',
      phoneNumber: '987654321',
      medicalCondition: 'Knee rehab',
      status: 'REGISTERED',
      clinicId: 'clinic-1',
      assignedPhysiotherapistId: null,
    } as unknown as Patient;

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('patient', patient);
    fixture.componentRef.setInput('pending', false);
    fixture.detectChanges();

    component['form'].controls.countryCode.setValue('+56');
    fixture.detectChanges();

    fixture.componentRef.setInput('patient', { ...patient });
    fixture.detectChanges();

    expect(component['form'].controls.countryCode.value).toBe('+56');
  });
});
