import {PatientResponse} from './patient-response';

export interface PatientRequest {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition?: string;
  assignedPhysiotherapistId?: string;
}

export interface AssignPatientRequest {
  physiotherapistId: string;
}

export type {PatientResponse};