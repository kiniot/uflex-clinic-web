import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { buildApiUrl } from '../../../../shared/infrastructure/api-url';
import { SubscriptionPlan } from '../../../domain/models/subscription-plan';
import { PlanRepository } from '../../../domain/repositories/plan-repository';
import { PlanDtoAssembler } from '../assemblers/plan-dto.assembler';
import { PlanDto } from '../dtos/plan.dto';

@Injectable({ providedIn: 'root' })
export class HttpPlanRepository implements PlanRepository {
  private readonly http = inject(HttpClient);
  private readonly plansUrl = buildApiUrl(
    environment.apiBaseUrl,
    environment.subscription.plansEndpoint,
  );

  findAllActive(): Observable<Array<SubscriptionPlan>> {
    return this.http
      .get<unknown>(this.plansUrl)
      .pipe(
        map((response) =>
          extractArray<PlanDto>(response).map((plan) => PlanDtoAssembler.toModelFromDto(plan)),
        ),
      );
  }

  findById(id: string): Observable<SubscriptionPlan | null> {
    return this.http
      .get<PlanDto>(`${this.plansUrl}/${encodeURIComponent(id)}`)
      .pipe(map((plan) => PlanDtoAssembler.toModelFromDto(plan)));
  }
}

function extractArray<T>(response: unknown): Array<T> {
  if (Array.isArray(response)) return response as Array<T>;
  if (!response || typeof response !== 'object') return [];

  const record = response as Record<string, unknown>;
  const data = record['data'];
  const content = record['content'];
  const items = record['items'];

  if (Array.isArray(data)) return data as Array<T>;
  if (Array.isArray(content)) return content as Array<T>;
  if (Array.isArray(items)) return items as Array<T>;

  return [];
}
