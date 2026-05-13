import { PlanDto } from './plan.dto';
import { PaymentReferenceDto } from './payment-reference.dto';

export interface SubscriptionDto {
  id: string;
  clinicId: string;
  plan: PlanDto;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  paymentReference: PaymentReferenceDto;
}
