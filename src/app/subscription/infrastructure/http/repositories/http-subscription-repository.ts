import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { buildApiUrl } from '../../../../shared/infrastructure/api-url';
import { BillingCycle } from '../../../domain/models/billing-cycle.enum';
import { Subscription } from '../../../domain/models/subscription';
import { SubscriptionRepository } from '../../../domain/repositories/subscription-repository';
import { PaymentReference } from '../../../domain/value-objects/payment-reference';
import { SubscriptionDtoAssembler } from '../assemblers/subscription-dto.assembler';
import { CancelSubscriptionDto } from '../dtos/cancel-subscription.dto';
import { ChangePlanDto } from '../dtos/change-plan.dto';
import { PaymentReferenceDto } from '../dtos/payment-reference.dto';
import { PurchaseSubscriptionDto } from '../dtos/purchase-subscription.dto';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { UpdatePaymentMethodDto } from '../dtos/update-payment-method.dto';

@Injectable({ providedIn: 'root' })
export class HttpSubscriptionRepository implements SubscriptionRepository {
  private readonly http = inject(HttpClient);
  private readonly subscriptionsUrl = buildApiUrl(
    environment.apiBaseUrl,
    environment.subscription.subscriptionsEndpoint,
  );

  findCurrent(): Observable<Subscription | null> {
    return this.http.get<unknown>(`${this.subscriptionsUrl}/current`).pipe(
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

  findPaymentMethod(): Observable<PaymentReference | null> {
    return this.http.get<unknown>(`${this.subscriptionsUrl}/payment-method`).pipe(
      map((response) => extractObject<PaymentReferenceDto>(response)),
      map((paymentMethod) => (paymentMethod ? toPaymentReferenceFromDto(paymentMethod) : null)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of(null);
        throw error;
      }),
    );
  }

  purchase(
    clinicId: string,
    planId: string,
    billingCycle: BillingCycle,
    paymentToken: string,
  ): Observable<Subscription> {
    const body: PurchaseSubscriptionDto = {
      clinicId,
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

function extractObject<T>(response: unknown): T | null {
  if (!response || typeof response !== 'object') return null;

  const record = response as Record<string, unknown>;
  const data = record['data'];

  if (data && typeof data === 'object') return data as T;
  return response as T;
}

function toPaymentReferenceFromDto(dto: PaymentReferenceDto): PaymentReference {
  const record = dto as Record<string, unknown>;
  const brand = stringValue(record, 'brand', 'cardBrand') || 'card';

  return new PaymentReference(
    stringValue(record, 'providerToken', 'paymentToken') ||
      stringValue(record, 'token') ||
      'stripe',
    stringValue(record, 'last4', 'cardLast4'),
    expirationValue(record),
    brand,
  );
}

function expirationValue(dto: Record<string, unknown>): string {
  const explicit = stringValue(dto, 'expiresOn', 'expiration');
  if (explicit) return explicit;

  const expMonth = numberValue(dto, 'expMonth');
  const expYear = numberValue(dto, 'expYear');
  if (!expMonth || !expYear) return '';

  return `${expMonth}/${expYear}`;
}

function stringValue(
  dto: Record<string, unknown>,
  key: string,
  alternateKey?: string,
  fallback = '',
): string {
  const value = dto[key] ?? (alternateKey ? dto[alternateKey] : undefined);
  return typeof value === 'string' ? value : fallback;
}

function numberValue(dto: Record<string, unknown>, key: string): number {
  const value = dto[key];
  return typeof value === 'number' ? value : Number(value ?? 0);
}
