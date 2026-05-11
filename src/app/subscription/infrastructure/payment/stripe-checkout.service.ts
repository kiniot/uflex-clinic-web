import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
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

  startCheckout(clinicId: string, planId: string, billingCycle: BillingCycle): Observable<void> {
    if (!environment.stripe.enabled || environment.subscription.useMockApi) {
      return of('/subscription?payment=success').pipe(
        tap((checkoutUrl) => {
          window.location.href = checkoutUrl;
        }),
        map(() => undefined),
      );
    }

    const body: CreateStripeCheckoutSessionDto = { clinicId, planId, billingCycle };

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
}
