import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../../domain/models/subscription';
import { StripeCheckoutService } from '../../infrastructure/payment/stripe-checkout.service';

@Injectable({ providedIn: 'root' })
export class ConfirmStripeCheckoutSessionUseCase {
  private readonly stripeCheckoutService = inject(StripeCheckoutService);

  execute(sessionId: string): Observable<Subscription> {
    return this.stripeCheckoutService.confirmCheckoutSession(sessionId);
  }
}
