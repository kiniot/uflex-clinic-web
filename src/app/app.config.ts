import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { iamInterceptor } from './iam/infrastructure/iam.interceptor';
import { providePrimeNG } from 'primeng/config';
import { appPreset } from './app.preset';
import { PLAN_REPOSITORY } from './subscription/domain/repositories/plan-repository';
import { SUBSCRIPTION_REPOSITORY } from './subscription/domain/repositories/subscription-repository';
import { INVOICE_REPOSITORY } from './subscription/domain/repositories/invoice-repository';
import { MockPlanRepository } from './subscription/infrastructure/repositories/mock-plan-repository';
import { MockSubscriptionRepository } from './subscription/infrastructure/repositories/mock-subscription-repository';
import { MockInvoiceRepository } from './subscription/infrastructure/repositories/mock-invoice-repository';

/**
 * Application configuration for dependency injection and providers in the infrastructure layer.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([iamInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: appPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false,
        },
      },
    }),
    { provide: PLAN_REPOSITORY, useClass: MockPlanRepository },
    { provide: SUBSCRIPTION_REPOSITORY, useClass: MockSubscriptionRepository },
    { provide: INVOICE_REPOSITORY, useClass: MockInvoiceRepository },
  ],
};
