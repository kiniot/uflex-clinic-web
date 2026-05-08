import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../../domain/models/subscription';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository';

/**
 * Application use case for retrieving the current clinic subscription.
 */
@Injectable({ providedIn: 'root' })
export class GetCurrentSubscriptionUseCase {
  private readonly subscriptionRepository = inject(SUBSCRIPTION_REPOSITORY);

  execute(clinicId: string): Observable<Subscription | null> {
    return this.subscriptionRepository.findCurrentByClinicId(clinicId);
  }
}
