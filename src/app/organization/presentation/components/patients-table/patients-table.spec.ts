import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Patient } from '../../../domain/model/patient.entity';
import { PatientsTable } from './patients-table';

describe('PatientsTable', () => {
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
    assignedPhysiotherapistId: null,
    status: 'REGISTERED',
    clinicId: 'clinic-1',
  } as unknown as Patient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsTable, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('emits row open, edit, assign and delete actions', () => {
    const fixture = TestBed.createComponent(PatientsTable);
    const component = fixture.componentInstance;
    const rowOpenSpy = vi.fn();
    const editSpy = vi.fn();
    const assignSpy = vi.fn();
    const deleteSpy = vi.fn();

    fixture.componentRef.setInput('patients', [patient]);
    fixture.componentRef.setInput('physiotherapistNames', {});
    component.rowOpen.subscribe(rowOpenSpy);
    component.edit.subscribe(editSpy);
    component.assign.subscribe(assignSpy);
    component.delete.subscribe(deleteSpy);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();
    buttons[2].click();
    buttons[3].click();

    expect(rowOpenSpy).toHaveBeenCalledWith(patient);
    expect(editSpy).toHaveBeenCalledWith(patient);
    expect(assignSpy).toHaveBeenCalledWith(patient);
    expect(deleteSpy).toHaveBeenCalledWith(patient);
  });
});
