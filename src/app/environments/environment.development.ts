export const environment = {
  production: false,

  apiBaseUrl: 'http://localhost:8080/api/v1',

  subscription: {
    useMockApi: true,
    plansEndpoint: '/plans',
    subscriptionsEndpoint: '/subscriptions',
    invoicesEndpoint: '/invoices'
  },

  culqi: {
    enabled: false,
    publicKey: 'pk_test_replace_me'
  }
};
