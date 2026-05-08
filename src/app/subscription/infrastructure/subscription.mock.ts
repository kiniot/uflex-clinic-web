import {ActiveSubscription} from '../domain/model/active-subscription.entity';
import {Invoice} from '../domain/model/invoice.entity';
import {PaymentMethod} from '../domain/model/payment-method.entity';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';

/**
 * Subscription mocks used while the backend is not yet wired.
 */

export const MOCK_PLANS: SubscriptionPlan[] = [
  new SubscriptionPlan({
    id: 1,
    name: 'Clinical Basic',
    description: 'Essential tools for independent therapists.',
    monthlyPrice: 149,
    features: [
      {label: 'Up to 5 Active Licenses', included: true},
      {label: 'Standard Gait Tracking', included: true},
      {label: 'AI Pattern Recognition', included: false}
    ]
  }),
  new SubscriptionPlan({
    id: 2,
    name: 'Enterprise Pro',
    description: 'For small to medium clinic networks.',
    monthlyPrice: 499,
    features: [
      {label: 'Up to 50 Active Licenses', included: true},
      {label: 'Full Analytics Suite', included: true},
      {label: 'API Integration Access', included: true}
    ]
  })
];

export const MOCK_ACTIVE_SUBSCRIPTION = new ActiveSubscription({
  id: 1,
  planId: 2,
  renewsAtLabel: 'Renews Oct 24, 2026',
  billingCycle: 'monthly',
  activeLicenses: 42,
  totalLicenses: 50,
  storageUsageTb: 1.2,
  apiStatus: 'healthy'
});

export const MOCK_PAYMENT_METHOD = new PaymentMethod({
  id: 1,
  last4: '8842',
  cardHolder: 'ST. JUDE MEDICAL CTR',
  expiryLabel: '08 / 26'
});

export const MOCK_INVOICES: Invoice[] = [
  new Invoice({id: 1, amount: 499, planName: 'Enterprise Pro', status: 'paid', issuedAtLabel: 'Sep 24, 2026'}),
  new Invoice({id: 2, amount: 499, planName: 'Enterprise Pro', status: 'paid', issuedAtLabel: 'Aug 24, 2026'}),
  new Invoice({id: 3, amount: 499, planName: 'Enterprise Pro', status: 'paid', issuedAtLabel: 'Jul 24, 2026'})
];
