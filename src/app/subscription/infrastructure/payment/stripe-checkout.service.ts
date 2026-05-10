import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { CreateStripeCheckoutSessionDto } from '../http/dtos/create-stripe-checkout-session.dto';
import { StripeCheckoutSessionResponseDto } from '../http/dtos/stripe-checkout-session-response.dto';

@Injectable({ providedIn: 'root' })
export class StripeCheckoutService {
  private readonly http = inject(HttpClient);
  private readonly checkoutSessionUrl = `${environment.apiBaseUrl}${environment.subscription.checkoutSessionEndpoint}`;

  createCheckoutSession(
    clinicId: string,
    planId: string,
    billingCycle: BillingCycle,
  ): Observable<string> {
    if (!environment.stripe.enabled || environment.subscription.useMockApi) {
      return of('/subscription?payment=success');
    }

    const body: CreateStripeCheckoutSessionDto = { clinicId, planId, billingCycle };

    return this.http.post<StripeCheckoutSessionResponseDto>(this.checkoutSessionUrl, body).pipe(
      map((response) => response.checkoutUrl),
      tap((checkoutUrl) => {
        window.location.href = checkoutUrl;
      }),
    );
  }
}
