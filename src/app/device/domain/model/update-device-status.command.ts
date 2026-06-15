import { DeviceStatus } from './device.types';

export interface UpdateDeviceStatusCommand {
  deviceId: string;
  status: DeviceStatus;
}
