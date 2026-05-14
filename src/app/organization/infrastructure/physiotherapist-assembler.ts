import {PhysiotherapistRequest} from './physiotherapist-request';
import {PhysiotherapistResource, PhysiotherapistResponse} from './physiotherapist-response';
import {TeamMember} from '../domain/model/team-member.entity';
import {RegisterPhysiotherapistCommand} from '../domain/model/register-physiotherapist.command';

export class PhysiotherapistAssembler {
  toRequestFromCommand(command: RegisterPhysiotherapistCommand): PhysiotherapistRequest {
    return {
      fullName: command.fullName,
      specialty: command.specialty as 'TRAUMATOLOGICAL' | 'NEUROLOGICAL' | 'SPORTS' | 'GENERAL',
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      licenseNumber: command.licenseNumber,
      professionalSummary: command.professionalSummary || undefined,
      photoUrl: command.photoUrl || undefined,
      yearsOfExperience: command.yearsOfExperience
    };
  }

  toResourceFromResponse(response: PhysiotherapistResponse): PhysiotherapistResource {
    return {
      id: response.id,
      userId: response.userId,
      clinicId: response.clinicId,
      fullName: response.fullName,
      specialty: response.specialty,
      email: response.email,
      countryCode: response.countryCode,
      phoneNumber: response.phoneNumber,
      licenseNumber: response.licenseNumber,
      professionalSummary: response.professionalSummary,
      photoUrl: response.photoUrl,
      yearsOfExperience: response.yearsOfExperience,
      hireDate: response.hireDate,
      status: response.status
    };
  }

  toEntityFromResource(resource: PhysiotherapistResource): TeamMember {
    return new TeamMember({
      id: resource.id,
      fullName: resource.fullName,
      email: resource.email,
      specialty: resource.specialty,
      status: resource.status,
      phoneNumber: resource.phoneNumber,
      countryCode: resource.countryCode,
      licenseNumber: resource.licenseNumber,
      professionalSummary: resource.professionalSummary,
      photoUrl: resource.photoUrl,
      yearsOfExperience: resource.yearsOfExperience,
      hireDate: resource.hireDate,
      activePatients: 0
    });
  }

  toEntitiesFromResponse(response: PhysiotherapistResponse[]): TeamMember[] {
    return response.map(r => this.toEntityFromResource(r as unknown as PhysiotherapistResource));
  }
}