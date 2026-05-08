/**
 * Value object for subscription money values and currency consistency.
 */
export class Money {
  constructor(
    private readonly amountValue: number,
    private readonly currencyValue: string,
  ) {}

  get amount(): number {
    return this.amountValue;
  }

  get currency(): string {
    return this.currencyValue;
  }

  formatted(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
