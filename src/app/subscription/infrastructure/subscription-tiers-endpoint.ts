import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SubscriptionTier } from '../domain/model/subscription-tier.entity';
import { SubscriptionTierAssembler } from './subscription-tier-assembler';
import { SubscriptionTierResponse } from './subscription-tiers-response';

const subscriptionTiersApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderSubscriptionTiersEndpointPath,
);

export class SubscriptionTiersApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: SubscriptionTierAssembler,
  ) {
    super();
  }

  getAll(): Observable<SubscriptionTier[]> {
    return this.http.get<SubscriptionTierResponse[]>(subscriptionTiersApiEndpointUrl).pipe(
      map((response) => response.map((tier) => this.assembler.toEntityFromResponse(tier))),
      catchError(this.handleError('Failed to load subscription tiers')),
    );
  }
}
