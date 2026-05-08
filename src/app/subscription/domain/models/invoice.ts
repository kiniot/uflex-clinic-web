import { InvoiceStatus } from './invoice-status.enum';
import { Money } from '../value-objects/money';

/**
 * Domain model for billing documents associated with a subscription.
 */
export class Invoice {
  constructor(
    private readonly idValue: string,
    private readonly subscriptionIdValue: string,
    private readonly issuedAtValue: Date,
    private readonly dueAtValue: Date,
    private readonly amountValue: Money,
    private readonly statusValue: InvoiceStatus,
  ) {}

  get id(): string {
    return this.idValue;
  }

  get subscriptionId(): string {
    return this.subscriptionIdValue;
  }

  get issuedAt(): Date {
    return this.issuedAtValue;
  }

  get dueAt(): Date {
    return this.dueAtValue;
  }

  get amount(): Money {
    return this.amountValue;
  }

  get status(): InvoiceStatus {
    return this.statusValue;
  }
}
