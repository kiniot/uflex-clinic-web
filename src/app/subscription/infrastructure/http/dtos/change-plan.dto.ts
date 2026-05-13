import { BillingCycle } from '../../../domain/models/billing-cycle.enum';

export interface ChangePlanDto {
  newPlanId: string;
  newBillingCycle: BillingCycle;
}
