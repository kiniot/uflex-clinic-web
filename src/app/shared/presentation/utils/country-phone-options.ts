import { TranslateService } from '@ngx-translate/core';

export interface CountryPhoneOption {
  flag: string;
  isoCode: string;
  phoneCode: string;
  label: string;
}

export function buildCountryPhoneOptions(translate: TranslateService): CountryPhoneOption[] {
  return [
    countryPhoneOption(translate, 'PE', '+51', 'countries.peru', '🇵🇪'),
    countryPhoneOption(translate, 'CL', '+56', 'countries.chile', '🇨🇱'),
    countryPhoneOption(translate, 'CO', '+57', 'countries.colombia', '🇨🇴'),
    countryPhoneOption(translate, 'EC', '+593', 'countries.ecuador', '🇪🇨'),
    countryPhoneOption(translate, 'MX', '+52', 'countries.mexico', '🇲🇽'),
    countryPhoneOption(translate, 'AR', '+54', 'countries.argentina', '🇦🇷'),
    countryPhoneOption(translate, 'US', '+1', 'countries.unitedStates', '🇺🇸'),
  ];
}

function countryPhoneOption(
  translate: TranslateService,
  isoCode: string,
  phoneCode: string,
  labelKey: string,
  flag: string,
): CountryPhoneOption {
  return {
    flag,
    isoCode,
    phoneCode,
    label: translate.instant(labelKey),
  };
}
