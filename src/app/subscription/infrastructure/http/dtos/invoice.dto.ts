export interface InvoiceDto {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  issuedAt: string;
  dueAt: string;
  paidAt?: string | null;
  status: string;
  providerTransactionId?: string | null;
}
