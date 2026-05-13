import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentReference } from '../../domain/value-objects/payment-reference';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

@Injectable({ providedIn: 'root' })
export class GetPaymentMethodUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(): Observable<PaymentReference | null> {
    return this.subscriptionRepository.findPaymentMethod();
  }
}
