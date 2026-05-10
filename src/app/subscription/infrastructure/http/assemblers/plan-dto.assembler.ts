import { Money } from '../../../domain/value-objects/money';
import { SubscriptionPlan } from '../../../domain/models/subscription-plan';
import { PlanDto } from '../dtos/plan.dto';

type BackendPlanDto = PlanDto & Record<string, unknown>;

export class PlanDtoAssembler {
  static toModelFromDto(dto: PlanDto): SubscriptionPlan {
    const backendDto = dto as BackendPlanDto;
    const currency = stringValue(backendDto, 'currency', 'PEN');

    return new SubscriptionPlan(
      stringValue(backendDto, 'id'),
      stringValue(backendDto, 'name'),
      stringValue(backendDto, 'code'),
      new Money(numberValue(backendDto, 'monthlyPrice', 'monthly_price'), currency),
      new Money(numberValue(backendDto, 'yearlyPrice', 'yearly_price'), currency),
      numberValue(backendDto, 'maxPatients', 'max_patients'),
      numberValue(backendDto, 'maxPhysiotherapists', 'max_physiotherapists'),
      stringArrayValue(backendDto, 'features'),
      booleanValue(backendDto, 'active', true),
    );
  }
}

function stringValue(dto: Record<string, unknown>, key: string, fallback = ''): string {
  const value = dto[key];
  return typeof value === 'string' ? value : fallback;
}

function numberValue(dto: Record<string, unknown>, key: string, alternateKey: string): number {
  const value = dto[key] ?? dto[alternateKey];
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function booleanValue(dto: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const value = dto[key];
  return typeof value === 'boolean' ? value : fallback;
}

function stringArrayValue(dto: Record<string, unknown>, key: string): Array<string> {
  const value = dto[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}
