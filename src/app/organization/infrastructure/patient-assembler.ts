import {PatientResource, PatientResponse} from './patient-response';
import {PatientRequest, AssignPatientRequest} from './patient-request';
import {Patient} from '../domain/model/patient.entity';
import {UnassignedPatient} from '../domain/model/unassigned-patient.entity';
import {CareTag} from '../domain/model/unassigned-patient.types';

export class PatientAssembler {
  toRequestFromCommand(
    firstName: string,
    lastName: string,
    dni: string,
    birthDate: string,
    gender: 'MALE' | 'FEMALE' | 'OTHER',
    email: string,
    countryCode: string,
    phoneNumber: string,
    medicalCondition?: string,
    assignedPhysiotherapistId?: string
  ): PatientRequest {
    return {
      firstName,
      lastName,
      dni,
      birthDate,
      gender,
      email,
      countryCode,
      phoneNumber,
      medicalCondition: medicalCondition || undefined,
      assignedPhysiotherapistId: assignedPhysiotherapistId || undefined
    };
  }

  toAssignRequest(physiotherapistId: string): AssignPatientRequest {
    return {physiotherapistId};
  }

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
      assignedPhysiotherapistId: response.assignedPhysiotherapistId,
      treatmentPlanId: response.treatmentPlanId,
      status: response.status,
      clinicId: response.clinicId
    };
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
      treatmentPlanId: resource.treatmentPlanId,
      status: resource.status,
      clinicId: resource.clinicId
    });
  }

  toUnassignedPatientFromResource(resource: PatientResource): UnassignedPatient {
    const name = `${resource.firstName} ${resource.lastName}`;
    const condition = resource.medicalCondition || '';
    const arrivedLabel = 'registered';
    const tags = this.deriveCareTags(condition, resource.status);

    return new UnassignedPatient({
      id: resource.id,
      name,
      condition,
      arrivedLabel,
      tags
    });
  }

  toEntitiesFromResponse(response: PatientResponse[]): Patient[] {
    return response.map(r => this.toEntityFromResource(r as unknown as PatientResource));
  }

  private deriveCareTags(condition: string, status: string): CareTag[] {
    const tags: CareTag[] = [];
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('crónico') || lowerCondition.includes('grave') || lowerCondition.includes('crítico')) {
      tags.push('critical-care');
    }
    if (lowerCondition.includes('domicilio') || lowerCondition.includes('casa')) {
      tags.push('home-visit');
    }
    if (status === 'UNASSIGNED' && tags.length === 0) {
      tags.push('outpatient');
    }

    return tags;
  }
}