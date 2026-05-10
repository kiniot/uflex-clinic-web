import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { SubscriptionDtoAssembler } from '../assemblers/subscription-dto.assembler';
import { CancelSubscriptionDto } from '../dtos/cancel-subscription.dto';
import { ChangePlanDto } from '../dtos/change-plan.dto';
import { PurchaseSubscriptionDto } from '../dtos/purchase-subscription.dto';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { UpdatePaymentMethodDto } from '../dtos/update-payment-method.dto';

@Injectable({ providedIn: 'root' })
export class HttpSubscriptionRepository implements SubscriptionRepository {
  private readonly http = inject(HttpClient);
  private readonly subscriptionsUrl = `${environment.apiBaseUrl}${environment.subscription.subscriptionsEndpoint}`;

  findCurrentByClinicId(clinicId: string): Observable<Subscription | null> {
    return this.http
      .get<unknown>(`${this.subscriptionsUrl}?clinicId=${encodeURIComponent(clinicId)}`)
      .pipe(
        map((response) => extractSubscription(response)),
        map((subscription) =>
          subscription ? SubscriptionDtoAssembler.toModelFromDto(subscription) : null,
        ),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) return of(null);
          throw error;
        }),
      );
  }

  purchase(
    planId: string,
    billingCycle: BillingCycle,
    paymentToken: string,
  ): Observable<Subscription> {
    const body: PurchaseSubscriptionDto = {
      clinicId: environment.subscription.clinicId,
      planId,
      billingCycle,
      paymentToken,
    };

    return this.http
      .post<SubscriptionDto>(this.subscriptionsUrl, body)
      .pipe(map((subscription) => SubscriptionDtoAssembler.toModelFromDto(subscription)));
  }

  cancel(subscriptionId: string, reason: string): Observable<Subscription> {
    const body: CancelSubscriptionDto = { reason };

    return this.http
      .post<SubscriptionDto>(
        `${this.subscriptionsUrl}/${encodeURIComponent(subscriptionId)}/cancel`,
        body,
      )
      .pipe(map((subscription) => SubscriptionDtoAssembler.toModelFromDto(subscription)));
  }

  changePlan(
    subscriptionId: string,
    newPlanId: string,
    newBillingCycle: BillingCycle,
  ): Observable<Subscription> {
    const body: ChangePlanDto = { newPlanId, newBillingCycle };

    return this.http
      .patch<SubscriptionDto>(
        `${this.subscriptionsUrl}/${encodeURIComponent(subscriptionId)}/plan`,
        body,
      )
      .pipe(map((subscription) => SubscriptionDtoAssembler.toModelFromDto(subscription)));
  }

  updatePaymentMethod(subscriptionId: string, paymentToken: string): Observable<Subscription> {
    const body: UpdatePaymentMethodDto = { paymentToken };

    return this.http
      .patch<SubscriptionDto>(
        `${this.subscriptionsUrl}/${encodeURIComponent(subscriptionId)}/payment-method`,
        body,
      )
      .pipe(map((subscription) => SubscriptionDtoAssembler.toModelFromDto(subscription)));
  }
}

function extractSubscription(response: unknown): SubscriptionDto | null {
  if (!response) return null;
  if (Array.isArray(response)) return (response[0] as SubscriptionDto | undefined) ?? null;
  if (typeof response !== 'object') return null;

  const record = response as Record<string, unknown>;
  const data = record['data'];
  const content = record['content'];
  const items = record['items'];

  if (Array.isArray(data)) return (data[0] as SubscriptionDto | undefined) ?? null;
  if (Array.isArray(content)) return (content[0] as SubscriptionDto | undefined) ?? null;
  if (Array.isArray(items)) return (items[0] as SubscriptionDto | undefined) ?? null;
  if (data && typeof data === 'object') return data as SubscriptionDto;

  return response as SubscriptionDto;
}
