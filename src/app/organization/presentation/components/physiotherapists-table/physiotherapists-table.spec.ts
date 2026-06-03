import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';
import { PhysiotherapistsTable } from './physiotherapists-table';

describe('PhysiotherapistsTable', () => {
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
    photoUrl: '',
    yearsOfExperience: 7,
    hireDate: '2025-01-01',
    status: 'ACTIVE',
  } as unknown as PhysiotherapistProfile;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysiotherapistsTable, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('emits rowOpen when the row and the eye action are used', () => {
    const fixture = TestBed.createComponent(PhysiotherapistsTable);
    const component = fixture.componentInstance;
    const rowOpenSpy = vi.fn();

    fixture.componentRef.setInput('physiotherapists', [physiotherapist]);
    component.rowOpen.subscribe(rowOpenSpy);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const row = fixture.nativeElement.querySelector('tbody tr');

    row.click();
    buttons[0].click();

    expect(rowOpenSpy).toHaveBeenCalledTimes(2);
    expect(rowOpenSpy).toHaveBeenNthCalledWith(1, physiotherapist);
    expect(rowOpenSpy).toHaveBeenNthCalledWith(2, physiotherapist);
  });

  it('renders suspend for active physiotherapists and reactivate for suspended ones', () => {
    const fixture = TestBed.createComponent(PhysiotherapistsTable);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('physiotherapists', [physiotherapist]);
    fixture.detectChanges();
    expect(component['statusActionKey'](physiotherapist)).toBe(
      'organization.physiotherapists.actions.suspend',
    );

    const suspended = { ...physiotherapist, status: 'SUSPENDED' } as PhysiotherapistProfile;
    fixture.componentRef.setInput('physiotherapists', [suspended]);
    fixture.detectChanges();
    expect(component['statusActionKey'](suspended)).toBe(
      'organization.physiotherapists.actions.reactivate',
    );
  });

  it('keeps the suspend action available for inactive physiotherapists', () => {
    const fixture = TestBed.createComponent(PhysiotherapistsTable);
    const component = fixture.componentInstance;
    const inactive = { ...physiotherapist, status: 'INACTIVE' } as PhysiotherapistProfile;

    fixture.componentRef.setInput('physiotherapists', [inactive]);
    fixture.detectChanges();

    expect(component['statusActionKey'](inactive)).toBe(
      'organization.physiotherapists.actions.suspend',
    );
  });
});
