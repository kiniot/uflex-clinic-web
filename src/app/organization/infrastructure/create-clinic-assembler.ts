import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { ClinicAddressRequest, CreateClinicRequest } from './create-clinic.request';
import {
  ClinicAddressResource,
  ClinicResource,
  CreateClinicResponse,
} from './create-clinic-response';

export class CreateClinicAssembler {
  toResourceFromResponse(response: CreateClinicResponse): ClinicResource {
    return {
      id: response.id,
      legalName: response.legalName,
      commercialName: response.commercialName,
      ruc: response.ruc,
      email: response.email,
      countryCode: response.countryCode,
      phoneNumber: response.phoneNumber,
      address: this.toAddressResource(response.address),
    } as ClinicResource;
  }

  toRequestFromCommand(command: CreateClinicCommand): CreateClinicRequest {
    return {
      legalName: command.legalName,
      commercialName: command.commercialName,
      ruc: command.ruc,
      email: command.email,
      countryCode: command.countryCode,
      phoneNumber: command.phoneNumber,
      address: {
        countryCode: command.address.countryCode,
        region: command.address.region,
        city: command.address.city,
        addressLine1: command.address.addressLine1,
        addressLine2: command.address.addressLine2,
        postalCode: command.address.postalCode,
      } satisfies ClinicAddressRequest,
    } as CreateClinicRequest;
  }

  private toAddressResource(address: ClinicAddressResource): ClinicAddressResource {
    return {
      countryCode: address.countryCode,
      region: address.region,
      city: address.city,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? null,
      postalCode: address.postalCode ?? null,
    };
  }
}
