import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Subscription } from '../../domain/models/subscription';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

/**
 * Application use case for purchasing a plan with a future payment token provider.
 */
@Injectable({ providedIn: 'root' })
export class PurchaseSubscriptionUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(
    planId: string,
    billingCycle: BillingCycle,
    paymentToken: string,
  ): Observable<Subscription> {
    return this.subscriptionRepository.purchase(planId, billingCycle, paymentToken);
  }
}
