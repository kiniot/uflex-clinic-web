import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

loadDotEnv('.env');
loadDotEnv('.env.local');

const envDir = resolve(rootDir, 'src/environments');
const prodPath = resolve(envDir, 'environment.ts');
const devPath = resolve(envDir, 'environment.development.ts');

mkdirSync(envDir, { recursive: true });

writeFileSync(prodPath, environmentFile());
writeFileSync(devPath, environmentFile());

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

function environmentFile() {
  const config = {
    apiBaseUrl: value('NG_APP_API_BASE_URL', 'http://localhost:8080/api/v1'),
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
    platformProviderCurrentClinicEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_CURRENT_CLINIC_ENDPOINT_PATH',
      '/clinics/me',
    ),
    platformProviderCurrentClinicAdminEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_CURRENT_CLINIC_ADMIN_ENDPOINT_PATH',
      '/clinic-admins/me',
    ),
    platformProviderCurrentPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_CURRENT_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists/me',
    ),
    platformProviderPhysiotherapistsEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_PHYSIOTHERAPISTS_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderRegisterPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_REGISTER_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderPhysiotherapistByIdEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_PHYSIOTHERAPIST_BY_ID_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderUpdatePhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_UPDATE_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderDeletePhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_DELETE_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderSuspendPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_SUSPEND_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderReactivatePhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_REACTIVATE_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/physiotherapists',
    ),
    platformProviderMyPatientsEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_MY_PATIENTS_ENDPOINT_PATH',
      '/physiotherapists/me/patients',
    ),
    platformProviderPatientsEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_PATIENTS_ENDPOINT_PATH',
      '/patients',
    ),
    platformProviderRegisterPatientByClinicAdminEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_REGISTER_PATIENT_BY_CLINIC_ADMIN_ENDPOINT_PATH',
      '/patients/by-clinic-admin',
    ),
    platformProviderRegisterPatientByPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_REGISTER_PATIENT_BY_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/patients/by-physiotherapist',
    ),
    platformProviderPatientsByPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_PATIENTS_BY_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/patients/by-physiotherapist',
    ),
    platformProviderPatientsByClinicEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_PATIENTS_BY_CLINIC_ENDPOINT_PATH',
      '/patients/by-clinic',
    ),
    platformProviderUpdatePatientByPhysiotherapistEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_UPDATE_PATIENT_BY_PHYSIOTHERAPIST_ENDPOINT_PATH',
      '/patients/by-physiotherapist',
    ),
    platformProviderUpdatePatientByClinicAdminEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_UPDATE_PATIENT_BY_CLINIC_ADMIN_ENDPOINT_PATH',
      '/patients/by-clinic-admin',
    ),
    platformProviderDeletePatientEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_DELETE_PATIENT_ENDPOINT_PATH',
      '/patients',
    ),
    platformProviderAssignPatientEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_ASSIGN_PATIENT_ENDPOINT_PATH',
      '/patients',
    ),
    platformProviderTreatmentPlansEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_TREATMENT_PLANS_ENDPOINT_PATH',
      '/treatment-plans',
    ),
    platformProviderExercisesEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_EXERCISES_ENDPOINT_PATH',
      '/exercises',
    ),
    platformProviderSubscriptionTiersEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_SUBSCRIPTION_TIERS_ENDPOINT_PATH',
      '/subscriptions/tiers',
    ),
    platformProviderSubscriptionCheckoutEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_SUBSCRIPTION_CHECKOUT_ENDPOINT_PATH',
      '/subscriptions/checkout',
    ),
    platformProviderCurrentSubscriptionEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_CURRENT_SUBSCRIPTION_ENDPOINT_PATH',
      '/subscriptions/current',
    ),
    platformProviderDevicesEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_DEVICES_ENDPOINT_PATH',
      '/devices',
    ),
    platformProviderDeviceMetricsEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_DEVICE_METRICS_ENDPOINT_PATH',
      '/devices/metrics',
    ),
    platformProviderMyAssignedDeviceEndpointPath: value(
      'NG_APP_PLATFORM_PROVIDER_MY_ASSIGNED_DEVICE_ENDPOINT_PATH',
      '/devices/my-assigned',
    ),
  };

  return `export const environment = ${JSON.stringify(config, null, 2)};\n`;
}

function value(key, fallback) {
  return process.env[key] ?? fallback;
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
