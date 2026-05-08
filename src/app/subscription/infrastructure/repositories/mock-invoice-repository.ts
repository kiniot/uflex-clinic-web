import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '../../domain/models/invoice';
import { InvoiceRepository } from '../../domain/repositories/invoice-repository';
import { mockInvoices } from '../mock/subscription-mock-data';

/**
 * Mock repository for invoice history until billing endpoints are available.
 */
@Injectable({ providedIn: 'root' })
export class MockInvoiceRepository implements InvoiceRepository {
  findBySubscriptionId(subscriptionId: string): Observable<Array<Invoice>> {
    return of(mockInvoices.filter((invoice) => invoice.subscriptionId === subscriptionId));
  }
}
