export const environment = {
  production: true,

  apiBaseUrl: 'https://api.uflex.com/api/v1',

  subscription: {
    useMockApi: false,
    plansEndpoint: '/plans',
    subscriptionsEndpoint: '/subscriptions',
    invoicesEndpoint: '/invoices'
  },

  culqi: {
    enabled: true,
    publicKey: 'pk_live_replace_me'
  }
};
