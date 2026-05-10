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

    return new Subscription(
      stringValue(backendDto, 'id'),
      stringValue(backendDto, 'clinicId', 'clinic_id'),
      PlanDtoAssembler.toModelFromDto(dto.plan),
      enumValue(backendDto, 'status', SubscriptionStatus.Active),
      enumValue(backendDto, 'billingCycle', BillingCycle.Monthly, 'billing_cycle'),
      dateValue(backendDto, 'currentPeriodStart', 'current_period_start'),
      dateValue(backendDto, 'currentPeriodEnd', 'current_period_end'),
      dateValue(backendDto, 'nextBillingDate', 'next_billing_date'),
      new PaymentReference(
        stringValue(paymentReference, 'providerToken') || 'stripe',
        stringValue(paymentReference, 'last4', 'cardLast4') || '****',
        stringValue(paymentReference, 'expiresOn', 'expiration') || '--/----',
      ),
    );
  }
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
