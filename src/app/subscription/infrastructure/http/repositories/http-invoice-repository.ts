import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Invoice } from '../../../domain/models/invoice';
import { InvoiceRepository } from '../../../domain/repositories/invoice-repository';
import { InvoiceDtoAssembler } from '../assemblers/invoice-dto.assembler';
import { InvoiceDto } from '../dtos/invoice.dto';

@Injectable({ providedIn: 'root' })
export class HttpInvoiceRepository implements InvoiceRepository {
  private readonly http = inject(HttpClient);
  private readonly invoicesUrl = `${environment.apiBaseUrl}${environment.subscription.invoicesEndpoint}`;

  findAll(): Observable<Array<Invoice>> {
    return this.http
      .get<unknown>(this.invoicesUrl)
      .pipe(
        map((response) =>
          extractArray<InvoiceDto>(response).map((invoice) =>
            InvoiceDtoAssembler.toModelFromDto(invoice),
          ),
        ),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) return of([]);
          throw error;
        }),
      );
  }
}

function extractArray<T>(response: unknown): Array<T> {
  if (Array.isArray(response)) return response as Array<T>;
  if (!response || typeof response !== 'object') return [];

  const record = response as Record<string, unknown>;
  const data = record['data'];
  const content = record['content'];
  const items = record['items'];

  if (Array.isArray(data)) return data as Array<T>;
  if (Array.isArray(content)) return content as Array<T>;
  if (Array.isArray(items)) return items as Array<T>;

  return [];
}
