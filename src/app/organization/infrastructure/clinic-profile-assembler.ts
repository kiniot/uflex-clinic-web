import { ClinicAddressValue } from '../domain/model/clinic-address.value';
import { ClinicProfile } from '../domain/model/clinic-profile.entity';
import { ClinicProfileResponse, ClinicProfileResource } from './clinic-profile-response';

export class ClinicProfileAssembler {
  toResourceFromResponse(response: ClinicProfileResponse): ClinicProfileResource {
    return {
      id: response.id,
      legalName: response.legalName,
      commercialName: response.commercialName,
      ruc: response.ruc,
      email: response.email,
      countryCode: response.countryCode,
      phoneNumber: response.phoneNumber,
      address: {
        countryCode: response.address.countryCode,
        region: response.address.region,
        city: response.address.city,
        addressLine1: response.address.addressLine1,
        addressLine2: response.address.addressLine2 ?? null,
        postalCode: response.address.postalCode ?? null,
      },
    } as ClinicProfileResource;
  }

  toEntityFromResource(resource: ClinicProfileResource): ClinicProfile {
    return new ClinicProfile({
      id: resource.id,
      legalName: resource.legalName,
      commercialName: resource.commercialName,
      ruc: resource.ruc,
      email: resource.email,
      countryCode: resource.countryCode,
      phoneNumber: resource.phoneNumber,
      address: new ClinicAddressValue({
        countryCode: resource.address.countryCode,
        region: resource.address.region,
        city: resource.address.city,
        addressLine1: resource.address.addressLine1,
        addressLine2: resource.address.addressLine2,
        postalCode: resource.address.postalCode,
      }),
    });
  }
}
