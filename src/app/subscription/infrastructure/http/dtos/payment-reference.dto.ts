export interface PaymentReferenceDto {
  providerToken?: string | null;
  paymentToken?: string | null;
  token?: string | null;
  last4?: string | null;
  cardLast4?: string | null;
  expiresOn?: string | null;
  expiration?: string | null;
}
