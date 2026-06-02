import { ClinicAdminProfile } from '../domain/model/clinic-admin-profile.entity';
import {
  ClinicAdminProfileResource,
  ClinicAdminProfileResponse,
} from './clinic-admin-profile-response';

export class ClinicAdminProfileAssembler {
  toResourceFromResponse(response: ClinicAdminProfileResponse): ClinicAdminProfileResource {
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
      clinicId: response.clinicId,
    } as ClinicAdminProfileResource;
  }

  toEntityFromResource(resource: ClinicAdminProfileResource): ClinicAdminProfile {
    return new ClinicAdminProfile({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      dni: resource.dni,
      birthDate: resource.birthDate,
      gender: resource.gender,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      clinicId: resource.clinicId,
    });
  }
}
