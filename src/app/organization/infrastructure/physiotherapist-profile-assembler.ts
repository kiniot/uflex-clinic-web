import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';
import { PhysiotherapistProfile } from '../domain/model/physiotherapist-profile.entity';
import {
  PhysiotherapistProfileResource,
  PhysiotherapistProfileResponse,
} from './physiotherapist-profile-response';
import { RegisterPhysiotherapistRequest } from './register-physiotherapist.request';

export class PhysiotherapistProfileAssembler {
  toResourceFromResponse(response: PhysiotherapistProfileResponse): PhysiotherapistProfileResource {
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
      professionalSummary: response.professionalSummary ?? null,
      photoUrl: response.photoUrl ?? null,
      yearsOfExperience: response.yearsOfExperience,
      hireDate: response.hireDate,
      status: response.status,
    } as PhysiotherapistProfileResource;
  }

  toEntityFromResource(resource: PhysiotherapistProfileResource): PhysiotherapistProfile {
    return new PhysiotherapistProfile({
      id: resource.id,
      userId: resource.userId,
      clinicId: resource.clinicId,
      fullName: resource.fullName,
      specialty: resource.specialty,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      licenseNumber: resource.licenseNumber,
      professionalSummary: resource.professionalSummary,
      photoUrl: resource.photoUrl,
      yearsOfExperience: resource.yearsOfExperience,
      hireDate: resource.hireDate,
      status: resource.status,
    });
  }

  toRequestFromCommand(command: RegisterPhysiotherapistCommand): RegisterPhysiotherapistRequest {
    return {
      fullName: command.fullName,
      specialty: command.specialty,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      licenseNumber: command.licenseNumber,
      professionalSummary: command.professionalSummary,
      photoUrl: command.photoUrl,
      yearsOfExperience: command.yearsOfExperience,
    } as RegisterPhysiotherapistRequest;
  }
}
