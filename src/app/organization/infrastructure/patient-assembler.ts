import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { Patient } from '../domain/model/patient.entity';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { UpdatePatientByClinicAdminCommand } from '../domain/model/update-patient-by-clinic-admin.command';
import { UpdatePatientContactCommand } from '../domain/model/update-patient-contact.command';
import { AssignPatientRequest } from './assign-patient.request';
import { PatientResource, PatientResponse } from './patient.response';
import { RegisterPatientRequest } from './register-patient.request';
import { UpdatePatientByClinicAdminRequest } from './update-patient-by-clinic-admin.request';
import { UpdatePatientByPhysiotherapistRequest } from './update-patient-by-physiotherapist.request';

export class PatientAssembler {
  toResourceFromResponse(response: PatientResponse): PatientResource {
    return {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      dni: response.dni,
      birthDate: response.birthDate,
      gender: response.gender,
      email: response.email,
      countryCode: response.countryCode,
      phoneNumber: response.phoneNumber,
      medicalCondition: response.medicalCondition,
      assignedPhysiotherapistId: response.assignedPhysiotherapistId ?? null,
      status: response.status,
      clinicId: response.clinicId,
    } as PatientResource;
  }

  toEntityFromResource(resource: PatientResource): Patient {
    return new Patient({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      dni: resource.dni,
      birthDate: resource.birthDate,
      gender: resource.gender,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      medicalCondition: resource.medicalCondition,
      assignedPhysiotherapistId: resource.assignedPhysiotherapistId,
      status: resource.status,
      clinicId: resource.clinicId,
    });
  }

  toRequestFromCommand(command: RegisterPatientCommand): RegisterPatientRequest {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      dni: command.dni,
      birthDate: command.birthDate,
      gender: command.gender,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      medicalCondition: command.medicalCondition,
      assignedPhysiotherapistId: command.assignedPhysiotherapistId,
    } as RegisterPatientRequest;
  }

  toAssignRequestFromCommand(command: AssignPatientCommand): AssignPatientRequest {
    return {
      physiotherapistId: command.physiotherapistId,
    } as AssignPatientRequest;
  }

  toUpdatePatientByPhysiotherapistRequestFromCommand(
    command: UpdatePatientContactCommand,
  ): UpdatePatientByPhysiotherapistRequest {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      medicalCondition: command.medicalCondition,
    } as UpdatePatientByPhysiotherapistRequest;
  }

  toUpdatePatientByClinicAdminRequestFromCommand(
    command: UpdatePatientByClinicAdminCommand,
  ): UpdatePatientByClinicAdminRequest {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      dni: command.dni,
      birthDate: command.birthDate,
      gender: command.gender,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      medicalCondition: command.medicalCondition,
      assignedPhysiotherapistId: command.assignedPhysiotherapistId,
    } as UpdatePatientByClinicAdminRequest;
  }
}
