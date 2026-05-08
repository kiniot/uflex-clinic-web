/**
 * Value object that keeps the safe, displayable payment method reference.
 */
export class PaymentReference {
  constructor(
    private readonly providerTokenValue: string,
    private readonly last4Value: string,
    private readonly expiresOnValue: string,
  ) {}

  get providerToken(): string {
    return this.providerTokenValue;
  }

  get last4(): string {
    return this.last4Value;
  }

  get expiresOn(): string {
    return this.expiresOnValue;
  }
}
