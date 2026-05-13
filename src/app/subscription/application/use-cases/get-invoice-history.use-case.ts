import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../../domain/models/invoice';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice-repository';

/**
 * Application use case for loading invoice history for a subscription.
 */
@Injectable({ providedIn: 'root' })
export class GetInvoiceHistoryUseCase {
  private readonly invoiceRepository = inject(INVOICE_REPOSITORY);

  execute(): Observable<Array<Invoice>> {
    return this.invoiceRepository.findAll();
  }
}
