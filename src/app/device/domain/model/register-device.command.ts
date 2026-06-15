export interface RegisterDeviceCommand {
  serialNumber: string;
  macAddress: string;
  firmwareVersion?: string;
  model?: string;
  advertisedName?: string;
}
