import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';

export interface InvoiceRepository {
  findBySubscriptionId(subscriptionId: string): Observable<Array<Invoice>>;
}

export const INVOICE_REPOSITORY = new InjectionToken<InvoiceRepository>('InvoiceRepository');
