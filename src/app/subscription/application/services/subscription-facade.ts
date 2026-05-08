import { Injectable, inject, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { Invoice } from '../../domain/models/invoice';
import { Subscription } from '../../domain/models/subscription';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { CancelSubscriptionUseCase } from '../use-cases/cancel-subscription.use-case';
import { ChangePlanUseCase } from '../use-cases/change-plan.use-case';
import { GetCurrentSubscriptionUseCase } from '../use-cases/get-current-subscription.use-case';
import { GetInvoiceHistoryUseCase } from '../use-cases/get-invoice-history.use-case';
import { GetPlansUseCase } from '../use-cases/get-plans.use-case';
import { PurchaseSubscriptionUseCase } from '../use-cases/purchase-subscription.use-case';
import { UpdatePaymentMethodUseCase } from '../use-cases/update-payment-method.use-case';

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
  private readonly updatePaymentMethodUseCase = inject(UpdatePaymentMethodUseCase);

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

  load(clinicId = 'clinic-demo-001'): void {
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
        error: () => this.errorSignal.set('No se pudo cargar la información de suscripción.'),
      });
  }

  purchase(planId: string, billingCycle: BillingCycle, paymentToken = 'mock-token'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.purchaseSubscriptionUseCase
      .execute(planId, billingCycle, paymentToken)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.setSubscription(subscription),
        error: () => this.errorSignal.set('No se pudo iniciar la suscripción.'),
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
        error: () => this.errorSignal.set('No se pudo cancelar la suscripción.'),
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
        error: () => this.errorSignal.set('No se pudo cambiar el plan.'),
      });
  }

  updatePaymentMethod(subscriptionId: string, paymentToken = 'mock-token'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.updatePaymentMethodUseCase
      .execute(subscriptionId, paymentToken)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (subscription) => this.currentSubscriptionSignal.set(subscription),
        error: () => this.errorSignal.set('No se pudo actualizar el método de pago.'),
      });
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
      error: () => this.errorSignal.set('No se pudo cargar el historial de facturas.'),
    });
  }
}
