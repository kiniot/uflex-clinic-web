import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Subscription } from '../../domain/models/subscription';
import { SubscriptionDtoAssembler } from '../http/assemblers/subscription-dto.assembler';
import { CreateStripeCheckoutSessionDto } from '../http/dtos/create-stripe-checkout-session.dto';
import { StripeCheckoutSessionResponseDto } from '../http/dtos/stripe-checkout-session-response.dto';
import { SubscriptionDto } from '../http/dtos/subscription.dto';

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
    const body: CreateStripeCheckoutSessionDto = { clinicId, planId, billingCycle };
    console.debug('[Subscription Checkout Payload]', body);

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

  confirmCheckoutSession(sessionId: string): Observable<Subscription> {
    return this.http
      .post<unknown>(`${this.checkoutSessionUrl}/confirm`, { sessionId })
      .pipe(map((response) => SubscriptionDtoAssembler.toModelFromDto(extractSubscription(response))));
  }
}

function extractSubscription(response: unknown): SubscriptionDto {
  if (!response || typeof response !== 'object') return response as SubscriptionDto;

  const record = response as Record<string, unknown>;
  const data = record['data'];
  const subscription = record['subscription'];

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>;
    const nestedSubscription = dataRecord['subscription'];
    if (nestedSubscription && typeof nestedSubscription === 'object') {
      return nestedSubscription as SubscriptionDto;
    }

    return data as SubscriptionDto;
  }

  if (subscription && typeof subscription === 'object') return subscription as SubscriptionDto;

  return response as SubscriptionDto;
}
