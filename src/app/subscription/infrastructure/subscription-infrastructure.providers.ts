import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { INVOICE_REPOSITORY } from '../domain/repositories/invoice-repository';
import { PLAN_REPOSITORY } from '../domain/repositories/plan-repository';
import { SUBSCRIPTION_REPOSITORY } from '../domain/repositories/subscription-repository';
import { HttpInvoiceRepository } from './http/repositories/http-invoice-repository';
import { HttpPlanRepository } from './http/repositories/http-plan-repository';
import { HttpSubscriptionRepository } from './http/repositories/http-subscription-repository';

export function provideSubscriptionInfrastructure(): EnvironmentProviders {
  return makeEnvironmentProviders(httpRepositoryProviders);
}

const httpRepositoryProviders: Array<Provider> = [
  { provide: PLAN_REPOSITORY, useClass: HttpPlanRepository },
  { provide: SUBSCRIPTION_REPOSITORY, useClass: HttpSubscriptionRepository },
  { provide: INVOICE_REPOSITORY, useClass: HttpInvoiceRepository },
];
