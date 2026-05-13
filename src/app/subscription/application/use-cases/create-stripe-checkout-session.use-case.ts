import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { StripeCheckoutService } from '../../infrastructure/payment/stripe-checkout.service';

@Injectable({ providedIn: 'root' })
export class CreateStripeCheckoutSessionUseCase {
  private readonly stripeCheckoutService = inject(StripeCheckoutService);

  execute(clinicId: string, planId: string, billingCycle: BillingCycle): Observable<void> {
    return this.stripeCheckoutService.startCheckout(clinicId, planId, billingCycle);
  }
}
