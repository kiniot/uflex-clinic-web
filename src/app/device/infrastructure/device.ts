import {Device} from '../domain/model/device.entity';
import {DeviceResource} from './device.resource';
import {DeviceAssembler} from './device.assembler';

export {DeviceAssembler} from './device.assembler';
export type {DeviceResource} from './device.resource';

export function buildDeviceEndpointUrl(serialNumber: string, path: string): string {
  return `${path}/${serialNumber}`;
}