import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Invoice } from '../../domain/models/invoice';
import { Subscription } from '../../domain/models/subscription';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { CancelSubscriptionUseCase } from '../use-cases/cancel-subscription.use-case';
import { ChangePlanUseCase } from '../use-cases/change-plan.use-case';
import { CreateStripeCheckoutSessionUseCase } from '../use-cases/create-stripe-checkout-session.use-case';
import { GetCurrentSubscriptionUseCase } from '../use-cases/get-current-subscription.use-case';
import { GetInvoiceHistoryUseCase } from '../use-cases/get-invoice-history.use-case';
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
  private readonly tenantContext = inject(SubscriptionTenantContextService);
  private readonly getPlansUseCase = inject(GetPlansUseCase);
  private readonly getCurrentSubscriptionUseCase = inject(GetCurrentSubscriptionUseCase);
  private readonly getInvoiceHistoryUseCase = inject(GetInvoiceHistoryUseCase);
  private readonly cancelSubscriptionUseCase = inject(CancelSubscriptionUseCase);
  private readonly changePlanUseCase = inject(ChangePlanUseCase);
  private readonly createStripeCheckoutSessionUseCase = inject(CreateStripeCheckoutSessionUseCase);

  private readonly plansSignal = signal<Array<SubscriptionPlan>>([]);
  private readonly currentSubscriptionSignal = signal<Subscription | null>(null);
  private readonly currentClinicIdSignal = signal<string | null>(null);
  private readonly invoicesSignal = signal<Array<Invoice>>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  readonly currentSubscription = this.currentSubscriptionSignal.asReadonly();
  readonly invoices = this.invoicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.invoicesSignal.set([]);

    forkJoin({
      plans: this.getPlansUseCase.execute().pipe(
        catchError((error: unknown) => {
          this.setLoadError(error);
          return of([]);
        }),
      ),
      clinicId: this.resolveClinicId().pipe(
        catchError((error: unknown) => {
          this.setTenantResolutionError(error);
          return of(null);
        }),
      ),
    })
      .pipe(
        switchMap(({ plans, clinicId }) => {
          this.plansSignal.set(plans);
          this.currentClinicIdSignal.set(clinicId);

          if (!clinicId) {
            this.currentSubscriptionSignal.set(null);
            return of(null);
          }

          return this.getCurrentSubscriptionUseCase.execute(clinicId);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: (currentSubscription) => {
          this.currentSubscriptionSignal.set(currentSubscription);
          this.loadInvoices(currentSubscription?.id ?? null);
        },
        error: (error: unknown) => this.setLoadError(error),
      });
  }

  startCheckout(planId: string, billingCycle: BillingCycle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.resolveClinicId()
      .pipe(
        switchMap((clinicId) =>
          this.createStripeCheckoutSessionUseCase.execute(clinicId, planId, billingCycle),
        ),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          // StripeCheckoutService redirects to the checkoutUrl returned by the backend.
        },
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo iniciar Stripe Checkout. Inténtalo nuevamente.'),
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
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.resolveClinicId()
      .pipe(
        switchMap(() => this.changePlanUseCase.execute(subscriptionId, newPlanId, billingCycle)),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: (subscription) => this.setSubscription(subscription),
        error: (error: unknown) => this.setActionError(error, 'No se pudo cambiar el plan.'),
      });
  }

  updatePaymentMethod(subscriptionId: string): void {
    void subscriptionId;
    if (!this.currentClinicIdSignal()) {
      this.errorSignal.set('Debes iniciar sesión para gestionar la suscripción.');
      return;
    }

    this.errorSignal.set(
      'El método de pago se actualizará de forma segura mediante Stripe Checkout cuando el backend exponga ese flujo.',
    );
  }

  private setSubscription(subscription: Subscription): void {
    this.currentSubscriptionSignal.set(subscription);
    this.currentClinicIdSignal.set(subscription.clinicId);
    this.loadInvoices(subscription.id);
  }

  private loadInvoices(subscriptionId: string | null): void {
    if (!subscriptionId) {
      this.invoicesSignal.set([]);
      return;
    }

    this.getInvoiceHistoryUseCase.execute(subscriptionId).subscribe({
      next: (invoices) => this.invoicesSignal.set(invoices),
      error: (error: unknown) =>
        this.setActionError(error, 'No se pudo cargar el historial de facturas.'),
    });
  }

  private resolveClinicId() {
    const cachedClinicId = this.currentClinicIdSignal();
    if (cachedClinicId) return of(cachedClinicId);
    return this.tenantContext
      .resolveClinicId()
      .pipe(tap((clinicId) => this.currentClinicIdSignal.set(clinicId)));
  }

  private setTenantResolutionError(error: unknown): void {
    if (error instanceof MissingSubscriptionTokenError) {
      this.errorSignal.set('Debes iniciar sesión para gestionar la suscripción.');
      return;
    }

    if (error instanceof MissingSubscriptionTenantError) {
      this.errorSignal.set('Tu usuario todavía no tiene una clínica asociada.');
      return;
    }

    this.setLoadError(error);
  }

  private setLoadError(error: unknown): void {
    if (isUnauthorized(error)) {
      this.errorSignal.set('Debes iniciar sesión para gestionar la suscripción.');
      return;
    }

    if (isBackendError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set('No se pudo cargar la información de suscripción.');
  }

  private setActionError(error: unknown, fallbackMessage: string): void {
    if (error instanceof MissingSubscriptionTokenError || isUnauthorized(error)) {
      this.errorSignal.set('Debes iniciar sesión para gestionar la suscripción.');
      return;
    }

    if (error instanceof MissingSubscriptionTenantError) {
      this.errorSignal.set('Tu usuario todavía no tiene una clínica asociada.');
      return;
    }

    if (isBackendError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set(fallbackMessage);
  }
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403);
}

function isBackendError(error: unknown): boolean {
  return error instanceof HttpErrorResponse;
}
