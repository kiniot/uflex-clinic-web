import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionStatus } from '../../../domain/models/subscription-status.enum';
import { PaymentReference } from '../../../domain/value-objects/payment-reference';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { PlanDtoAssembler } from './plan-dto.assembler';

type BackendSubscriptionDto = SubscriptionDto & Record<string, unknown>;

export class SubscriptionDtoAssembler {
  static toModelFromDto(dto: SubscriptionDto): Subscription {
    const backendDto = dto as BackendSubscriptionDto;
    const paymentReference = objectValue(backendDto, 'paymentReference', 'payment_reference');
    const billingCycle = enumValue(
      backendDto,
      'billingCycle',
      BillingCycle.Monthly,
      'billing_cycle',
    );

    return new Subscription(
      stringValue(backendDto, 'id'),
      stringValue(backendDto, 'clinicId', 'clinic_id'),
      PlanDtoAssembler.toModelFromDto(planDtoFromSubscription(backendDto, billingCycle)),
      enumValue(backendDto, 'status', SubscriptionStatus.Active),
      billingCycle,
      dateValue(backendDto, 'currentPeriodStart', 'current_period_start'),
      dateValue(backendDto, 'currentPeriodEnd', 'current_period_end'),
      dateValue(backendDto, 'nextBillingDate', 'next_billing_date'),
      new PaymentReference(
        stringValue(paymentReference, 'providerToken') || 'stripe',
        stringValue(paymentReference, 'last4', 'cardLast4'),
        stringValue(paymentReference, 'expiresOn', 'expiration'),
        stringValue(paymentReference, 'brand', 'cardBrand') || 'card',
      ),
    );
  }
}

function planDtoFromSubscription(
  dto: BackendSubscriptionDto,
  billingCycle: BillingCycle,
): NonNullable<SubscriptionDto['plan']> {
  if (dto.plan && typeof dto.plan === 'object') {
    return dto.plan;
  }

  const amount = numberValue(dto, 'amount', 'price');
  const planId = stringValue(dto, 'planId', 'plan_id');
  const planName = stringValue(dto, 'planName', 'plan_name') || titleFromPlanId(planId);
  const currency = stringValue(dto, 'currency', undefined, 'PEN');

  return {
    id: planId,
    name: planName,
    code: planId || planName,
    monthlyPrice: billingCycle === BillingCycle.Monthly ? amount : 0,
    yearlyPrice: billingCycle === BillingCycle.Yearly ? amount : amount * 12,
    currency,
    maxPatients: numberValue(dto, 'maxPatients', 'max_patients'),
    maxPhysiotherapists: numberValue(dto, 'maxPhysiotherapists', 'max_physiotherapists'),
    features: [],
    active: true,
  };
}

function titleFromPlanId(planId: string): string {
  if (!planId) return 'Subscription plan';
  return planId
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(' ');
}

function stringValue(
  dto: Record<string, unknown>,
  key: string,
  alternateKey?: string,
  fallback = '',
): string {
  const value = dto[key] ?? (alternateKey ? dto[alternateKey] : undefined);
  return typeof value === 'string' ? value : fallback;
}

function dateValue(dto: Record<string, unknown>, key: string, alternateKey: string): Date {
  const value = stringValue(dto, key, alternateKey);
  return value ? new Date(value) : new Date();
}

function numberValue(dto: Record<string, unknown>, key: string, alternateKey: string): number {
  const value = dto[key] ?? dto[alternateKey];
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function enumValue<T extends string>(
  dto: Record<string, unknown>,
  key: string,
  fallback: T,
  alternateKey?: string,
): T {
  const value = dto[key] ?? (alternateKey ? dto[alternateKey] : undefined);
  return typeof value === 'string' ? (value as T) : fallback;
}

function objectValue(
  dto: Record<string, unknown>,
  key: string,
  alternateKey: string,
): Record<string, unknown> {
  const value = dto[key] ?? dto[alternateKey];
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}
