import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { CreateStripeCheckoutSessionDto } from '../http/dtos/create-stripe-checkout-session.dto';
import { StripeCheckoutSessionResponseDto } from '../http/dtos/stripe-checkout-session-response.dto';

export class MissingStripeCheckoutUrlError extends Error {
  constructor() {
    super('Missing Stripe Checkout URL.');
  }
}

@Injectable({ providedIn: 'root' })
export class StripeCheckoutService {
  private readonly http = inject(HttpClient);
  private readonly checkoutSessionUrl = `${environment.apiBaseUrl}${environment.subscription.checkoutSessionEndpoint}`;

  startCheckout(planId: string, billingCycle: BillingCycle): Observable<void> {
    const body: CreateStripeCheckoutSessionDto = { planId, billingCycle };
    console.log('Checkout payload', body);

    return this.http.post<StripeCheckoutSessionResponseDto>(this.checkoutSessionUrl, body).pipe(
      map((response) => {
        if (!response.checkoutUrl) {
          throw new MissingStripeCheckoutUrlError();
        }

        return response.checkoutUrl;
      }),
      tap((checkoutUrl) => {
        window.location.href = checkoutUrl;
      }),
      map(() => undefined),
    );
  }

  confirmCheckoutSession(sessionId: string): Observable<void> {
    return this.http
      .post<void>(`${this.checkoutSessionUrl}/confirm`, { sessionId })
      .pipe(map(() => undefined));
  }
}
