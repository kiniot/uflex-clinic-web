export interface Patient {
  id: string;
  name: string;
  avatarInitials: string;
  condition: string;
  mrn: string;
  status: string;
}

export interface Device {
  id: string;
  serialNumber: string;
  advertisedName: string | null;
}

export interface DeviceOption {
  label: string;
  value: string;
}
