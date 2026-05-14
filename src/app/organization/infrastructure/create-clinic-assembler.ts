import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { CreateClinicRequest } from './create-clinic.request';
import { ClinicResource, CreateClinicResponse } from './create-clinic-response';

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
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
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
    } as CreateClinicRequest;
  }
}
