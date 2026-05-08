import {DecimalPipe} from '@angular/common';
import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Invoice} from '../../../domain/model/invoice.entity';

/**
 * Compact table of billing history rows. Each row shows the amount,
 * the plan name, and the invoice status as a colored pill.
 */
@Component({
  selector: 'app-billing-history-table',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './billing-history-table.html',
  styleUrl: './billing-history-table.scss'
})
export class BillingHistoryTable {
  invoices = input.required<Invoice[]>();
}
