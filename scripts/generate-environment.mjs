import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

loadDotEnv('.env');
loadDotEnv('.env.local');

const envDir = resolve(rootDir, 'src/environments');
const prodPath = resolve(envDir, 'environment.ts');
const devPath = resolve(envDir, 'environment.development.ts');
const prodAliasPath = resolve(envDir, 'environment.prod.ts');

mkdirSync(envDir, { recursive: true });

writeFileSync(prodPath, environmentFile({ production: true }));
writeFileSync(prodAliasPath, environmentFile({ production: true }));
writeFileSync(devPath, environmentFile({ production: false }));

console.log('Generated Angular environment files.');

function loadDotEnv(fileName) {
  const filePath = resolve(rootDir, fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = unquote(rawValue);
  }
}

function environmentFile({ production }) {
  const config = {
    production,
    apiBaseUrl: value('NG_APP_API_BASE_URL', 'http://localhost:8080/api/v1'),
    platformProviderApiBaseUrl: value(
      'NG_APP_PLATFORM_PROVIDER_API_BASE_URL',
      value('NG_APP_API_BASE_URL', 'http://localhost:8080/api/v1'),
    ),
    platformProviderSignInEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_SIGN_IN_ENDPOINT_PATH',
      '/authentication/sign-in',
    ),
    platformProviderSignUpEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_SIGN_UP_ENDPOINT_PATH',
      '/authentication/sign-up',
    ),
    platformProviderCreateClinicEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_CREATE_CLINIC_ENDPOINT_PATH',
      '/clinics',
    ),
    subscription: {
      useMockApi: booleanValue('NG_APP_SUBSCRIPTION_USE_MOCK_API', true),
      clinicId: value('NG_APP_SUBSCRIPTION_CLINIC_ID', '11111111-1111-1111-1111-111111111111'),
      plansEndpoint: value('NG_APP_SUBSCRIPTION_PLANS_ENDPOINT', '/plans'),
      subscriptionsEndpoint: value('NG_APP_SUBSCRIPTION_SUBSCRIPTIONS_ENDPOINT', '/subscriptions'),
      invoicesEndpoint: value('NG_APP_SUBSCRIPTION_INVOICES_ENDPOINT', '/invoices'),
      checkoutSessionEndpoint: value(
        'NG_APP_SUBSCRIPTION_CHECKOUT_SESSION_ENDPOINT',
        '/subscriptions/checkout-session',
      ),
    },
    stripe: {
      enabled: booleanValue('NG_APP_STRIPE_ENABLED', false),
      publishableKey: value('NG_APP_STRIPE_PUBLISHABLE_KEY', 'your_api_stripe_public'),
    },
  };

  return `export const environment = ${JSON.stringify(config, null, 2)};\n`;
}

function value(key, fallback) {
  return process.env[key] ?? fallback;
}

function booleanValue(key, fallback) {
  const rawValue = process.env[key];

  if (rawValue === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(rawValue.toLowerCase());
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
