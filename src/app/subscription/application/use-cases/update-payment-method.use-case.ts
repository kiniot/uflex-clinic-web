import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../../domain/models/subscription';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

/**
 * Legacy use case for replacing a backend-owned payment method reference.
 */
@Injectable({ providedIn: 'root' })
export class UpdatePaymentMethodUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(subscriptionId: string, paymentToken: string): Observable<Subscription> {
    return this.subscriptionRepository.updatePaymentMethod(subscriptionId, paymentToken);
  }
}
