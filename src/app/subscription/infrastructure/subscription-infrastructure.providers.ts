import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { INVOICE_REPOSITORY } from '../domain/repositories/invoice-repository';
import { PLAN_REPOSITORY } from '../domain/repositories/plan-repository';
import { SUBSCRIPTION_REPOSITORY } from '../domain/repositories/subscription-repository';
import { HttpInvoiceRepository } from './http/repositories/http-invoice-repository';
import { HttpPlanRepository } from './http/repositories/http-plan-repository';
import { HttpSubscriptionRepository } from './http/repositories/http-subscription-repository';
import { MockInvoiceRepository } from './repositories/mock-invoice-repository';
import { MockPlanRepository } from './repositories/mock-plan-repository';
import { MockSubscriptionRepository } from './repositories/mock-subscription-repository';

export function provideSubscriptionInfrastructure(): EnvironmentProviders {
  return makeEnvironmentProviders(
    environment.subscription.useMockApi ? mockRepositoryProviders : httpRepositoryProviders,
  );
}

const mockRepositoryProviders: Array<Provider> = [
  { provide: PLAN_REPOSITORY, useClass: MockPlanRepository },
  { provide: SUBSCRIPTION_REPOSITORY, useClass: MockSubscriptionRepository },
  { provide: INVOICE_REPOSITORY, useClass: MockInvoiceRepository },
];

const httpRepositoryProviders: Array<Provider> = [
  { provide: PLAN_REPOSITORY, useClass: HttpPlanRepository },
  { provide: SUBSCRIPTION_REPOSITORY, useClass: HttpSubscriptionRepository },
  { provide: INVOICE_REPOSITORY, useClass: HttpInvoiceRepository },
];
