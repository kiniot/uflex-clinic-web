import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../../domain/models/subscription';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

/**
 * Application use case for cancelling an active clinic subscription.
 */
@Injectable({ providedIn: 'root' })
export class CancelSubscriptionUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(subscriptionId: string, reason: string): Observable<Subscription> {
    return this.subscriptionRepository.cancel(subscriptionId, reason);
  }
}
