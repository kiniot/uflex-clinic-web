import { Money } from '../value-objects/money';

/**
 * Domain model for commercial plan rules available to clinics.
 */
export class SubscriptionPlan {
  constructor(
    private readonly idValue: string,
    private readonly nameValue: string,
    private readonly codeValue: string,
    private readonly monthlyPriceValue: Money,
    private readonly yearlyPriceValue: Money,
    private readonly maxPatientsValue: number,
    private readonly maxPhysiotherapistsValue: number,
    private readonly featuresValue: Array<string>,
    private readonly activeValue = true,
  ) {}

  get id(): string {
    return this.idValue;
  }

  get name(): string {
    return this.nameValue;
  }

  get code(): string {
    return this.codeValue;
  }

  get monthlyPrice(): Money {
    return this.monthlyPriceValue;
  }

  get yearlyPrice(): Money {
    return this.yearlyPriceValue;
  }

  get maxPatients(): number {
    return this.maxPatientsValue;
  }

  get maxPhysiotherapists(): number {
    return this.maxPhysiotherapistsValue;
  }

  get features(): Array<string> {
    return this.featuresValue;
  }

  get active(): boolean {
    return this.activeValue;
  }
}
