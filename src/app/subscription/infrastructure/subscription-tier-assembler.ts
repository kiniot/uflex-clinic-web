import { SubscriptionTier } from '../domain/model/subscription-tier.entity';
import { SubscriptionTierResponse } from './subscription-tiers-response';

export class SubscriptionTierAssembler {
  toEntityFromResponse(response: SubscriptionTierResponse): SubscriptionTier {
    return new SubscriptionTier({
      id: response.id,
      name: response.name,
      allowsPriceOverride: response.allowsPriceOverride,
      limits: response.limits,
      kits: response.kits,
      prices: response.prices,
      kitPrices: response.kitPrices,
    });
  }
}
