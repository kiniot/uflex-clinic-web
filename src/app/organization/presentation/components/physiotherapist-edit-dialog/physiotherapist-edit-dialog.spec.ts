import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';
import { PhysiotherapistEditDialog } from './physiotherapist-edit-dialog';

describe('PhysiotherapistEditDialog', () => {
  const physiotherapist = {
    id: 'physio-1',
    userId: 'user-1',
    clinicId: 'clinic-1',
    fullName: 'Ignacio Mestanza',
    specialty: 'NEUROLOGICAL',
    email: 'ignacio@example.com',
    countryCode: '+51',
    phoneNumber: '987654321',
    licenseNumber: 'CPT12345',
    professionalSummary: 'Neuro specialist',
    photoUrl: 'https://example.com/photo.jpg',
    yearsOfExperience: 7,
    hireDate: '2025-01-01',
    status: 'ACTIVE',
  } as unknown as PhysiotherapistProfile;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysiotherapistEditDialog, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('initializes with the physiotherapist data and emits an update command on save', () => {
    const fixture = TestBed.createComponent(PhysiotherapistEditDialog);
    const component = fixture.componentInstance;
    const saveSpy = vi.fn();

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('physiotherapist', physiotherapist);
    fixture.componentRef.setInput('pending', false);
    component.save.subscribe(saveSpy);
    fixture.detectChanges();

    component['form'].controls.fullName.setValue('Ignacio Actualizado');
    component['form'].controls.phoneNumber.setValue('999888777');
    component['onSave']();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy.mock.calls[0][0].fullName).toBe('Ignacio Actualizado');
    expect(saveSpy.mock.calls[0][0].phoneNumber).toBe('999888777');
  });
});
