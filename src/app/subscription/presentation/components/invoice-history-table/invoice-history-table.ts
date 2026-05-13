import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Invoice } from '../../../domain/models/invoice';
import { InvoiceStatus } from '../../../domain/models/invoice-status.enum';

/**
 * Internal billing history table for Subscription invoices.
 */
@Component({
  selector: 'app-invoice-history-table',
  imports: [DatePipe, TableModule, TagModule],
  templateUrl: './invoice-history-table.html',
  styleUrl: './invoice-history-table.scss',
})
export class InvoiceHistoryTable {
  invoices = input.required<Array<Invoice>>();

  invoiceLabel(invoice: Invoice): string {
    return invoice.id || 'Invoice';
  }

  statusSeverity(status: InvoiceStatus): 'success' | 'warn' | 'danger' | 'secondary' {
    if (status === InvoiceStatus.Paid) return 'success';
    if (status === InvoiceStatus.Pending) return 'warn';
    if (status === InvoiceStatus.Failed) return 'danger';
    return 'secondary';
  }
}
