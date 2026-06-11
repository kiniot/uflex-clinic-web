import {DeviceStatus} from './device.types';

export interface UpdateDeviceStatusCommand {
  serialNumber: string;
  status: DeviceStatus;
}