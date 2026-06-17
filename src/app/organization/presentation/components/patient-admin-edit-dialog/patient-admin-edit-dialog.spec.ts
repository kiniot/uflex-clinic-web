import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Patient } from '../../../domain/model/patient.entity';
import { PatientAdminEditDialog } from './patient-admin-edit-dialog';

describe('PatientAdminEditDialog', () => {
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
    assignedPhysiotherapistId: 'physio-1',
    status: 'IN_TREATMENT',
    clinicId: 'clinic-1',
  } as unknown as Patient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAdminEditDialog, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('emits the expected full patient payload while preserving the current assignment', () => {
    const fixture = TestBed.createComponent(PatientAdminEditDialog);
    const component = fixture.componentInstance;
    const saveSpy = vi.fn();

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('patient', patient);
    fixture.componentRef.setInput('pending', false);
    component.save.subscribe(saveSpy);
    fixture.detectChanges();

    component['form'].controls.firstName.setValue('Lucia Updated');
    component['form'].controls.medicalCondition.setValue('Updated condition');
    component['onSave']();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy.mock.calls[0][0].firstName).toBe('Lucia Updated');
    expect(saveSpy.mock.calls[0][0].assignedPhysiotherapistId).toBe('physio-1');
  });
});
