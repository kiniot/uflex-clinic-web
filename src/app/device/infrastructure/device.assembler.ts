import { Device } from '../domain/model/device.entity';
import { DeviceResource } from './device.resource';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';

export class DeviceAssembler implements BaseAssembler<Device, DeviceResource, BaseResponse> {
  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: String(resource.id),
      serialNumber: resource.serialNumber,
      macAddress: resource.macAddress,
      firmwareVersion: resource.firmwareVersion,
      batteryLevel: resource.batteryLevel,
      model: resource.model,
      advertisedName: resource.advertisedName,
      calibrationStatus: resource.calibrationStatus,
      status: resource.status,
      lastSeenAt: resource.lastSeenAt ? new Date(resource.lastSeenAt) : null,
      clinicId: resource.clinicId,
      currentPatientId: resource.currentPatientId,
      currentPatientFullName: resource.currentPatientFullName,
      offline: resource.offline,
    });
  }

  toResourceFromEntity(entity: Device): DeviceResource {
    return {
      id: entity.id,
      serialNumber: entity.serialNumber,
      macAddress: entity.macAddress,
      firmwareVersion: entity.firmwareVersion,
      batteryLevel: entity.batteryLevel,
      model: entity.model,
      advertisedName: entity.advertisedName,
      calibrationStatus: entity.calibrationStatus,
      status: entity.status,
      lastSeenAt: entity.lastSeenAt ? entity.lastSeenAt.toISOString() : null,
      clinicId: entity.clinicId,
      currentPatientId: entity.currentPatientId,
      currentPatientFullName: entity.currentPatientFullName,
      offline: entity.offline,
    };
  }

  toEntitiesFromResponse(response: unknown): Device[] {
    const resources = response as DeviceResource[];
    return resources.map((r) => this.toEntityFromResource(r));
  }
}
