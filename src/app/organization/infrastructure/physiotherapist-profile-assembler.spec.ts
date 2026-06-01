import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';

describe('PhysiotherapistProfileAssembler', () => {
  it('maps the authenticated physiotherapist payload into a resource shape', () => {
    const assembler = new PhysiotherapistProfileAssembler();

    const resource = assembler.toResourceFromResponse({
      id: 'physio-id',
      userId: 'user-id',
      clinicId: 'clinic-id',
      fullName: 'Salim Ramirez',
      specialty: 'NEUROLOGICAL',
      email: 'salim@gmail.com',
      countryCode: '+51',
      phoneNumber: '987654321',
      licenseNumber: 'CPT12345',
      professionalSummary: 'Experienced physiotherapist',
      photoUrl: 'https://example.com/photo.jpg',
      yearsOfExperience: 10,
      hireDate: '2026-05-31',
      status: 'INACTIVE',
    });

    expect(resource.id).toBe('physio-id');
    expect(resource.userId).toBe('user-id');
    expect(resource.specialty).toBe('NEUROLOGICAL');
  });
});
