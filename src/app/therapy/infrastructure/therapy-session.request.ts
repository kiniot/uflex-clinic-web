export interface InitiateTherapyPreparationRequest {
  patientId: string;
  treatmentPlanId: string;
  iotDeviceId: string;
  routineId: string;
}

export interface ConfirmHardwareReadinessRequest {
  deviceId: string;
  sensorsPlaced: boolean;
}

export interface CancelTherapySessionRequest {
  reason: string;
}
