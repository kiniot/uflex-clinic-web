import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/subscription-plan';

export interface PlanRepository {
  findAllActive(): Observable<Array<SubscriptionPlan>>;
  findById(id: string): Observable<SubscriptionPlan | null>;
}

export const PLAN_REPOSITORY = new InjectionToken<PlanRepository>('PlanRepository');
