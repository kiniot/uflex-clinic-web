import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SubscriptionCheckoutCommand } from '../domain/model/subscription-checkout.command';
import { SubscriptionCheckoutRequest } from './subscription-checkout.request';
import { SubscriptionCheckoutResponse } from './subscription-checkout-response';

const subscriptionCheckoutApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderSubscriptionCheckoutEndpointPath,
);

export class SubscriptionCheckoutApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  checkout(command: SubscriptionCheckoutCommand): Observable<SubscriptionCheckoutResponse> {
    const request: SubscriptionCheckoutRequest = {
      tierId: command.tierId,
      billingPeriod: command.billingPeriod,
      amount: command.amount.toFixed(2),
      currency: command.currency,
      requestedTotalKits: command.requestedTotalKits,
    };

    return this.http.post<SubscriptionCheckoutResponse>(subscriptionCheckoutApiEndpointUrl, request).pipe(
      catchError(this.handleError('Failed to create subscription checkout')),
    );
  }
}
