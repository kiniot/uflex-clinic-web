import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
import { PurchaseSubscriptionUseCase } from '../use-cases/purchase-subscription.use-case';

/**
 * Signal facade that coordinates Subscription use cases for the presentation layer.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionFacade {
  private readonly getPlansUseCase = inject(GetPlansUseCase);
  private readonly getCurrentSubscriptionUseCase = inject(GetCurrentSubscriptionUseCase);
  private readonly getInvoiceHistoryUseCase = inject(GetInvoiceHistoryUseCase);
  private readonly purchaseSubscriptionUseCase = inject(PurchaseSubscriptionUseCase);
  private readonly cancelSubscriptionUseCase = inject(CancelSubscriptionUseCase);
  private readonly changePlanUseCase = inject(ChangePlanUseCase);
  private readonly createStripeCheckoutSessionUseCase = inject(CreateStripeCheckoutSessionUseCase);

  private readonly plansSignal = signal<Array<SubscriptionPlan>>([]);
  private readonly currentSubscriptionSignal = signal<Subscription | null>(null);
  private readonly invoicesSignal = signal<Array<Invoice>>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly plans = this.plansSignal.asReadonly();
  readonly currentSubscription = this.currentSubscriptionSignal.asReadonly();
  readonly invoices = this.invoicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  load(clinicId = environment.subscription.clinicId): void {
    // TODO: reemplazar clinicId demo por tenant real desde IAM/Organization.
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      plans: this.getPlansUseCase.execute(),
      currentSubscription: this.getCurrentSubscriptionUseCase.execute(clinicId),
    })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: ({ plans, currentSubscription }) => {
          this.plansSignal.set(plans);
          this.currentSubscriptionSignal.set(currentSubscription);
          this.loadInvoices(currentSubscription?.id ?? null);
        },
        error: (error: unknown) => this.setLoadError(error),
      });
  }

  purchase(planId: string, billingCycle: BillingCycle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.purchaseSubscriptionUseCase
      .execute(planId, billingCycle, 'stripe_checkout_mock')
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.setSubscription(subscription),
        error: (error: unknown) => this.setActionError(error, 'No se pudo iniciar la suscripcion.'),
      });
  }

  startCheckout(planId: string, billingCycle: BillingCycle): void {
    if (environment.subscription.useMockApi) {
      this.purchase(planId, billingCycle);
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // TODO: Reemplazar clinicId demo por tenant real desde IAM/Organization.
    this.createStripeCheckoutSessionUseCase
      .execute(environment.subscription.clinicId, planId, billingCycle)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: () => {
          // StripeCheckoutService redirects to the checkoutUrl returned by the backend.
        },
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo iniciar Stripe Checkout. Intentalo nuevamente.'),
      });
  }

  cancel(subscriptionId: string, reason = 'Requested from subscription dashboard'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.cancelSubscriptionUseCase
      .execute(subscriptionId, reason)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.currentSubscriptionSignal.set(subscription),
        error: (error: unknown) =>
          this.setActionError(error, 'No se pudo cancelar la suscripcion.'),
      });
  }

  changePlan(subscriptionId: string, newPlanId: string, billingCycle: BillingCycle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.changePlanUseCase
      .execute(subscriptionId, newPlanId, billingCycle)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.setSubscription(subscription),
        error: (error: unknown) => this.setActionError(error, 'No se pudo cambiar el plan.'),
      });
  }

  updatePaymentMethod(subscriptionId: string): void {
    void subscriptionId;
    this.errorSignal.set(
      'El metodo de pago se actualizara de forma segura mediante Stripe Checkout cuando el backend exponga ese flujo.',
    );
  }

  private setSubscription(subscription: Subscription): void {
    this.currentSubscriptionSignal.set(subscription);
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

  private setLoadError(error: unknown): void {
    if (isUnauthorized(error)) {
      this.errorSignal.set('Debes iniciar sesion para consultar la suscripcion.');
      return;
    }

    if (isConnectionError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set('No se pudo cargar la informacion de suscripcion.');
  }

  private setActionError(error: unknown, fallbackMessage: string): void {
    if (isUnauthorized(error)) {
      this.errorSignal.set('Debes iniciar sesion para consultar la suscripcion.');
      return;
    }

    if (isConnectionError(error)) {
      this.errorSignal.set('No se pudo conectar con el backend de Subscription.');
      return;
    }

    this.errorSignal.set(fallbackMessage);
  }
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403);
}

function isConnectionError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 0;
}
