import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StripeCheckoutService } from '../../infrastructure/payment/stripe-checkout.service';

@Injectable({ providedIn: 'root' })
export class ConfirmStripeCheckoutSessionUseCase {
  private readonly stripeCheckoutService = inject(StripeCheckoutService);

  execute(sessionId: string): Observable<void> {
    return this.stripeCheckoutService.confirmCheckoutSession(sessionId);
  }
}
