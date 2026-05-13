import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { IamStore } from '../../../iam/application/iam.store';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Invoice } from '../../domain/models/invoice';
import { Subscription } from '../../domain/models/subscription';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { PaymentReference } from '../../domain/value-objects/payment-reference';
import { CancelSubscriptionUseCase } from '../use-cases/cancel-subscription.use-case';
import { ChangePlanUseCase } from '../use-cases/change-plan.use-case';
import { ConfirmStripeCheckoutSessionUseCase } from '../use-cases/confirm-stripe-checkout-session.use-case';
import { CreateStripeCheckoutSessionUseCase } from '../use-cases/create-stripe-checkout-session.use-case';
import { GetCurrentSubscriptionUseCase } from '../use-cases/get-current-subscription.use-case';
import { GetInvoiceHistoryUseCase } from '../use-cases/get-invoice-history.use-case';
import { GetPaymentMethodUseCase } from '../use-cases/get-payment-method.use-case';
import { GetPlansUseCase } from '../use-cases/get-plans.use-case';
import {
  MissingSubscriptionTenantError,
  MissingSubscriptionTokenError,
  SubscriptionTenantContextService,
} from './subscription-tenant-context.service';

/**
 * Signal facade that coordinates Subscription use cases for the presentation layer.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionFacade {
  private readonly iamStore = inject(IamStore);
  private readonly tenantContext = inject(SubscriptionTenantContextService);
  private readonly getPlansUseCase = inject(GetPlansUseCase);
  private readonly getCurrentSubscriptionUseCase = inject(GetCurrentSubscriptionUseCase);
  private readonly getInvoiceHistoryUseCase = inject(GetInvoiceHistoryUseCase);
  private readonly getPaymentMethodUseCase = inject(GetPaymentMethodUseCase);
  private readonly cancelSubscriptionUseCase = inject(CancelSubscriptionUseCase);
  private readonly changePlanUseCase = inject(ChangePlanUseCase);
  private readonly confirmStripeCheckoutSessionUseCase = inject(
    ConfirmStripeCheckoutSessionUseCase,
  );
  private readonly createStripeCheckoutSessionUseCase = inject(CreateStripeCheckoutSessionUseCase);

  private readonly plansSignal = signal<Array<SubscriptionPlan>>([]);
  private readonly currentSubscriptionSignal = signal<Subscription | null>(null);
  private readonly currentClinicIdSignal = signal<string | null>(null);
  private readonly paymentReferenceSignal = signal<PaymentReference | null>(null);
  private readonly invoicesSignal = signal<Array<Invoice>>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  readonly currentSubscription = this.currentSubscriptionSignal.asReadonly();
  readonly paymentReference = this.paymentReferenceSignal.asReadonly();
  readonly invoices = this.invoicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  load(options: { checkoutSessionId?: string; onCheckoutConfirmed?: () => void } = {}): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.invoicesSignal.set([]);

    this.confirmCheckoutSessionIfNeeded(options.checkoutSessionId, options.onCheckoutConfirmed)
      .pipe(
        switchMap(() =>
          forkJoin({
            plans: this.getPlansUseCase.execute().pipe(
              catchError((error: unknown) => {
                this.setLoadError(error);
                return of([]);
              }),
            ),
            currentSubscription: this.getCurrentSubscriptionUseCase.execute().pipe(
              catchError((error: unknown) => {
                this.setLoadError(error);
                return of(null);
              }),
            ),
            paymentReference: this.getPaymentMethodUseCase.execute().pipe(
              catchError((error: unknown) => {
                this.setActionError(error, 'No se pudo cargar el método de pago.');
                return of(null);
              }),
            ),
            invoices: this.getInvoiceHistoryUseCase.execute().pipe(
              catchError((error: unknown) => {
                this.setActionError(error, 'No se pudo cargar el historial de facturas.');
                return of([]);
              }),
            ),
          }),
        ),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: ({ plans, currentSubscription, paymentReference, invoices }) => {
          this.plansSignal.set(plans);
          this.currentSubscriptionSignal.set(currentSubscription);
          this.currentClinicIdSignal.set(currentSubscription?.clinicId ?? null);
          this.paymentReferenceSignal.set(paymentReference);
          this.invoicesSignal.set(invoices);
        },
        error: (error: unknown) => this.setLoadError(error),
      });
  }

  startCheckout(planId: string, billingCycle: BillingCycle): void {
    if (!planId) {
      this.errorSignal.set('Selecciona un plan válido para continuar.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.createStripeCheckoutSessionUseCase
      .execute(planId, billingCycle)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: () => {
          // StripeCheckoutService redirects to the checkoutUrl returned by the backend.
        },
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo iniciar el cambio de plan.'),
      });
  }

  cancel(subscriptionId: string, reason = 'Requested from subscription dashboard'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.resolveClinicId()
      .pipe(
        switchMap(() => this.cancelSubscriptionUseCase.execute(subscriptionId, reason)),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: (subscription) => this.currentSubscriptionSignal.set(subscription),
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo cancelar la suscripción.'),
      });
  }

  changePlan(subscriptionId: string, newPlanId: string, billingCycle: BillingCycle): void {
    if (!newPlanId) {
      this.errorSignal.set('Selecciona un plan válido para continuar.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.changePlanUseCase
      .execute(subscriptionId, newPlanId, billingCycle)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.setSubscription(subscription),
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo iniciar el cambio de plan.'),
      });
  }

  updatePaymentMethod(subscriptionId: string): void {
    void subscriptionId;
    this.errorSignal.set(
      'El método de pago se actualizará de forma segura mediante Stripe Checkout cuando el backend exponga ese flujo.',
    );
  }

  private setSubscription(subscription: Subscription): void {
    this.currentSubscriptionSignal.set(subscription);
    this.currentClinicIdSignal.set(subscription.clinicId);
    this.load();
  }

  private resolveClinicId() {
    const cachedClinicId = this.currentClinicIdSignal();
    if (cachedClinicId) return of(cachedClinicId);
    return this.tenantContext
      .resolveClinicId()
      .pipe(tap((clinicId) => this.currentClinicIdSignal.set(clinicId)));
  }

  private confirmCheckoutSessionIfNeeded(sessionId?: string, onConfirmed?: () => void) {
    if (!sessionId) return of(undefined);

    return this.confirmStripeCheckoutSessionUseCase.execute(sessionId).pipe(
      tap(() => onConfirmed?.()),
      catchError((error: unknown) => {
        this.setActionError(error, 'No se pudo confirmar el pago de Stripe Checkout.');
        return of(undefined);
      }),
    );
  }

  private setLoadError(error: unknown): void {
    if (this.shouldShowSessionExpired(error)) {
      this.errorSignal.set('Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }

    if (isNetworkError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set('No se pudo cargar la información de suscripción.');
  }

  private setActionError(error: unknown, fallbackMessage: string): void {
    if (this.shouldShowSessionExpired(error)) {
      this.errorSignal.set('Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }

    if (error instanceof MissingSubscriptionTenantError) {
      this.errorSignal.set('Tu usuario todavía no tiene una clínica asociada.');
      return;
    }

    if (error instanceof HttpErrorResponse && error.status === 409) {
      this.errorSignal.set('El cambio de plan aún no está disponible.');
      return;
    }

    if (isNetworkError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set(fallbackMessage);
  }

  private hasAuthToken(): boolean {
    return Boolean(
      this.iamStore.currentToken() ??
      localStorage.getItem('token') ??
      sessionStorage.getItem('token') ??
      localStorage.getItem('jwt_token') ??
      sessionStorage.getItem('jwt_token'),
    );
  }

  private shouldShowSessionExpired(error: unknown): boolean {
    if (error instanceof MissingSubscriptionTokenError) {
      return !this.hasAuthToken();
    }

    if (!isUnauthorized(error)) {
      return false;
    }

    return !this.hasAuthToken() || hasExplicitExpiredOrInvalidTokenMessage(error);
  }
}

function isUnauthorized(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403);
}

function isNetworkError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 0;
}

function hasExplicitExpiredOrInvalidTokenMessage(error: HttpErrorResponse): boolean {
  const message = errorMessage(error.error).toLowerCase();
  return (
    message.includes('token expired') ||
    message.includes('expired token') ||
    message.includes('jwt expired') ||
    message.includes('token invalid') ||
    message.includes('invalid token') ||
    message.includes('jwt invalid') ||
    message.includes('invalid jwt')
  );
}

function errorMessage(errorBody: unknown): string {
  if (typeof errorBody === 'string') return errorBody;
  if (!errorBody || typeof errorBody !== 'object') return '';

  const record = errorBody as Record<string, unknown>;
  const values = [record['message'], record['error'], record['detail'], record['description']];
  return values.filter((value): value is string => typeof value === 'string').join(' ');
}
