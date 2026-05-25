import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SubscriptionCheckoutCommand } from '../domain/model/subscription-checkout.command';
import { SubscriptionTier } from '../domain/model/subscription-tier.entity';
import { CurrentSubscriptionResponse } from './subscription-current-response';
import { SubscriptionCheckoutResponse } from './subscription-checkout-response';
import { SubscriptionCheckoutApiEndpoint } from './subscription-checkout-endpoint';
import { CurrentSubscriptionApiEndpoint } from './subscription-current-endpoint';
import { SubscriptionTierAssembler } from './subscription-tier-assembler';
import { SubscriptionTiersApiEndpoint } from './subscription-tiers-endpoint';

@Injectable({ providedIn: 'root' })
export class SubscriptionApi extends BaseApi {
  private readonly tiersEndpoint: SubscriptionTiersApiEndpoint;
  private readonly checkoutEndpoint: SubscriptionCheckoutApiEndpoint;
  private readonly currentSubscriptionEndpoint: CurrentSubscriptionApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.tiersEndpoint = new SubscriptionTiersApiEndpoint(http, new SubscriptionTierAssembler());
    this.checkoutEndpoint = new SubscriptionCheckoutApiEndpoint(http);
    this.currentSubscriptionEndpoint = new CurrentSubscriptionApiEndpoint(http);
  }

  getTiers(): Observable<SubscriptionTier[]> {
    return this.tiersEndpoint.getAll();
  }

  checkout(command: SubscriptionCheckoutCommand): Observable<SubscriptionCheckoutResponse> {
    return this.checkoutEndpoint.checkout(command);
  }

  getCurrentSubscription(): Observable<CurrentSubscriptionResponse | null> {
    return this.currentSubscriptionEndpoint.getCurrent();
  }
}
