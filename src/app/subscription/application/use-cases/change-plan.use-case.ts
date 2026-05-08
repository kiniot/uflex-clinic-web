import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Subscription } from '../../domain/models/subscription';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

/**
 * Application use case for plan changes inside the same subscription.
 */
@Injectable({ providedIn: 'root' })
export class ChangePlanUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(
    subscriptionId: string,
    newPlanId: string,
    newBillingCycle: BillingCycle,
  ): Observable<Subscription> {
    return this.subscriptionRepository.changePlan(subscriptionId, newPlanId, newBillingCycle);
  }
}
