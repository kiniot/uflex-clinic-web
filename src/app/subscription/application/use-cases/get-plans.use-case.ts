import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { PLAN_REPOSITORY } from '../../domain/repositories/plan-repository';

/**
 * Application use case for listing active plans available to clinics.
 */
@Injectable({ providedIn: 'root' })
export class GetPlansUseCase {
  private readonly planRepository = inject(PLAN_REPOSITORY);

  execute(): Observable<Array<SubscriptionPlan>> {
    return this.planRepository.findAllActive();
  }
}
