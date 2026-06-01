import { PhysiotherapistProfile } from '../domain/model/physiotherapist-profile.entity';
import {
  PhysiotherapistProfileResource,
  PhysiotherapistProfileResponse,
} from './physiotherapist-profile-response';

export class PhysiotherapistProfileAssembler {
  toResourceFromResponse(
    response: PhysiotherapistProfileResponse,
  ): PhysiotherapistProfileResource {
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
}
