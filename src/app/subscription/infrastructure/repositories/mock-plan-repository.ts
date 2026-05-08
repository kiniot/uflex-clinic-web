import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { PlanRepository } from '../../domain/repositories/plan-repository';
import { mockPlans } from '../mock/subscription-mock-data';

/**
 * Mock repository for plan queries; replace with HTTP implementation when backend is available.
 */
@Injectable({ providedIn: 'root' })
export class MockPlanRepository implements PlanRepository {
  findAllActive(): Observable<Array<SubscriptionPlan>> {
    return of(mockPlans.filter((plan) => plan.active));
  }

  findById(id: string): Observable<SubscriptionPlan | null> {
    return of(mockPlans.find((plan) => plan.id === id) ?? null);
  }
}
