import { Invoice } from '../../../domain/models/invoice';
import { InvoiceStatus } from '../../../domain/models/invoice-status.enum';
import { Money } from '../../../domain/value-objects/money';
import { InvoiceDto } from '../dtos/invoice.dto';

type BackendInvoiceDto = InvoiceDto & Record<string, unknown>;

export class InvoiceDtoAssembler {
  static toModelFromDto(dto: InvoiceDto): Invoice {
    const backendDto = dto as BackendInvoiceDto;

    return new Invoice(
      stringValue(backendDto, 'invoiceNumber', 'number') ||
        stringValue(backendDto, 'id') ||
        stringValue(backendDto, 'invoiceId', 'invoice_id'),
      stringValue(backendDto, 'subscriptionId', 'subscription_id'),
      dateValue(backendDto, 'issuedAt', 'issued_at'),
      dateValue(backendDto, 'dueAt', 'due_at'),
      new Money(
        numberValue(backendDto, 'amount'),
        stringValue(backendDto, 'currency', undefined, 'PEN'),
      ),
      enumValue(backendDto, 'status', InvoiceStatus.Pending),
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

function numberValue(dto: Record<string, unknown>, key: string): number {
  const value = dto[key];
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function dateValue(dto: Record<string, unknown>, key: string, alternateKey: string): Date {
  const value = stringValue(dto, key, alternateKey);
  return value ? new Date(value) : new Date();
}

function enumValue<T extends string>(dto: Record<string, unknown>, key: string, fallback: T): T {
  const value = dto[key];
  return typeof value === 'string' ? (value as T) : fallback;
}
