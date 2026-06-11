export interface Patient {
  id: string;
  name: string;
  avatarInitials: string;
  condition: string;
  mrn: string;
  status: string;
}

export interface Device {
  serialNumber: string;
}

export interface DeviceOption {
  label: string;
  value: string;
}