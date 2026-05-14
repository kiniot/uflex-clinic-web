export interface PaymentReferenceDto {
  brand?: string | null;
  cardBrand?: string | null;
  providerToken?: string | null;
  paymentToken?: string | null;
  token?: string | null;
  last4?: string | null;
  cardLast4?: string | null;
  expiresOn?: string | null;
  expiration?: string | null;
  expMonth?: number | string | null;
  expYear?: number | string | null;
}
