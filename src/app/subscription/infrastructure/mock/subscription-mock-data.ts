import { Invoice } from '../../domain/models/invoice';
import { InvoiceStatus } from '../../domain/models/invoice-status.enum';
import { Subscription } from '../../domain/models/subscription';
import { BillingCycle } from '../../domain/models/billing-cycle.enum';
import { SubscriptionPlan } from '../../domain/models/subscription-plan';
import { SubscriptionStatus } from '../../domain/models/subscription-status.enum';
import { Money } from '../../domain/value-objects/money';
import { PaymentReference } from '../../domain/value-objects/payment-reference';

// Replace these in-memory mocks with API-backed DTO assemblers when Subscription backend exists.
export const mockPlans: Array<SubscriptionPlan> = [
  new SubscriptionPlan(
    'plan-starter',
    'Starter',
    'STARTER',
    new Money(149, 'PEN'),
    new Money(1490, 'PEN'),
    30,
    2,
    ['Seguimiento básico', 'Dashboard clínico', 'Historial de sesiones'],
  ),
  new SubscriptionPlan(
    'plan-professional',
    'Professional',
    'PROFESSIONAL',
    new Money(299, 'PEN'),
    new Money(2990, 'PEN'),
    120,
    8,
    ['Monitoreo ROM avanzado', 'Reportes clínicos', 'Alertas', 'Soporte prioritario'],
  ),
  new SubscriptionPlan(
    'plan-enterprise',
    'Enterprise',
    'ENTERPRISE',
    new Money(599, 'PEN'),
    new Money(5990, 'PEN'),
    500,
    30,
    ['Multi-sede', 'Integración avanzada', 'Auditoría', 'SLA empresarial'],
  ),
];

export const mockCurrentSubscription = new Subscription(
  'sub-demo-001',
  'clinic-demo-001',
  mockPlans[1],
  SubscriptionStatus.Active,
  BillingCycle.Monthly,
  new Date('2026-04-15T00:00:00'),
  new Date('2026-05-14T23:59:59'),
  new Date('2026-05-15T00:00:00'),
  new PaymentReference('mock-token', '4242', '12/2028'),
);

export const mockInvoices: Array<Invoice> = [
  new Invoice(
    'inv-demo-003',
    'sub-demo-001',
    new Date('2026-04-15T09:00:00'),
    new Date('2026-04-22T23:59:59'),
    new Money(299, 'PEN'),
    InvoiceStatus.Pending,
  ),
  new Invoice(
    'inv-demo-002',
    'sub-demo-001',
    new Date('2026-03-15T09:00:00'),
    new Date('2026-03-22T23:59:59'),
    new Money(299, 'PEN'),
    InvoiceStatus.Paid,
  ),
  new Invoice(
    'inv-demo-001',
    'sub-demo-001',
    new Date('2026-02-15T09:00:00'),
    new Date('2026-02-22T23:59:59'),
    new Money(299, 'PEN'),
    InvoiceStatus.Paid,
  ),
];
