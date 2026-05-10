export const environment = {
  production: true,
  apiBaseUrl: 'https://api.uflex.example.com/api/v1',

  platformProviderApiBaseUrl: 'https://api.uflex.example.com',
  platformProviderSignInEndpointPath: '/api/v1/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/api/v1/authentication/sign-up',

  subscription: {
    useMockApi: false,
    clinicId: '11111111-1111-1111-1111-111111111111',
    plansEndpoint: '/plans',
    subscriptionsEndpoint: '/subscriptions',
    invoicesEndpoint: '/invoices',
    checkoutSessionEndpoint: '/subscriptions/checkout-session',
  },

  stripe: {
    enabled: true,
    publishableKey: 'pk_live_replace_me',
  },
};
