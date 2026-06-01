import { PatientAssembler } from './patient-assembler';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';

describe('PatientAssembler', () => {
  it('maps backend patient responses preserving string ids and assignments', () => {
    const assembler = new PatientAssembler();

    const resource = assembler.toResourceFromResponse({
      id: '019e7e3d-61cb-73fc-990f-91dc6c19a3fa',
      firstName: 'Ignacio',
      lastName: 'Mestanza',
      dni: '72326004',
      birthDate: '2004-02-01',
      gender: 'MALE',
      email: 'patient@gmail.com',
      countryCode: '+51',
      phoneNumber: '958273817',
      medicalCondition: 'Fractura de antebrazo',
      assignedPhysiotherapistId: '019e7e3b-8c71-72c7-953e-2e638d359874',
      status: 'IN_TREATMENT',
      clinicId: '019e7e39-1cfe-76ba-944b-d9405516ea79',
    });

    expect(resource.id).toBe('019e7e3d-61cb-73fc-990f-91dc6c19a3fa');
    expect(resource.assignedPhysiotherapistId).toBe('019e7e3b-8c71-72c7-953e-2e638d359874');
    expect(resource.status).toBe('IN_TREATMENT');
  });

  it('maps register patient commands with nullable assignments into requests', () => {
    const assembler = new PatientAssembler();

    const request = assembler.toRequestFromCommand(
      new RegisterPatientCommand({
        firstName: 'Lucia',
        lastName: 'Ramos',
        dni: '74839210',
        birthDate: '1992-08-14',
        gender: 'FEMALE',
        email: 'lucia.ramos@example.com',
        countryCode: '+51',
        phoneNumber: '987654321',
        medicalCondition: 'Post-operative knee rehabilitation',
      }),
    );

    expect(request.assignedPhysiotherapistId).toBeNull();
  });

  it('maps assign patient commands into assign requests', () => {
    const assembler = new PatientAssembler();

    const request = assembler.toAssignRequestFromCommand(
      new AssignPatientCommand({ physiotherapistId: 'physio-1' }),
    );

    expect(request.physiotherapistId).toBe('physio-1');
  });
});
