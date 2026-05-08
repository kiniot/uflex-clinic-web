/**
 * Domain types for the device registration flow inside the Device
 * bounded context.
 */

export type RegistrationStepStatus = 'in-progress' | 'pending' | 'complete';

export interface RegistrationStep {
  id: string;
  label: string;
  status: RegistrationStepStatus;
}
