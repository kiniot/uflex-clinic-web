import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';

export interface InvoiceRepository {
  findAll(): Observable<Array<Invoice>>;
}

export const INVOICE_REPOSITORY = new InjectionToken<InvoiceRepository>('InvoiceRepository');
