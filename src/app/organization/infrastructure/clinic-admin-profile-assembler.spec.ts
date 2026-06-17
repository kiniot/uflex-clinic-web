import { ClinicAdminProfileAssembler } from './clinic-admin-profile-assembler';

describe('ClinicAdminProfileAssembler', () => {
  it('maps clinic admin responses into resources preserving string identifiers', () => {
    const assembler = new ClinicAdminProfileAssembler();

    const resource = assembler.toResourceFromResponse({
      id: 'admin-id',
      firstName: 'Lucia',
      lastName: 'Ramos',
      dni: '74839210',
      birthDate: '1992-08-14',
      gender: 'FEMALE',
      email: 'lucia.ramos@example.com',
      countryCode: '+51',
      phoneNumber: '987654321',
      clinicId: 'clinic-1',
    });

    expect(resource.id).toBe('admin-id');
    expect(resource.clinicId).toBe('clinic-1');
    expect(resource.phoneNumber).toBe('987654321');
  });
});
