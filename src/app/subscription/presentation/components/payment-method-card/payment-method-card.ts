import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaymentReference } from '../../../domain/value-objects/payment-reference';

/**
 * Internal visual card for displaying the saved payment method reference.
 */
@Component({
  selector: 'app-payment-method-card',
  imports: [ButtonModule, CardModule, TitleCasePipe],
  templateUrl: './payment-method-card.html',
  styleUrl: './payment-method-card.scss',
})
export class PaymentMethodCard {
  paymentReference = input.required<PaymentReference | null>();
  updateRequested = output<void>();

  hasLast4(paymentReference: PaymentReference): boolean {
    return Boolean(paymentReference.last4 && paymentReference.last4 !== '****');
  }

  hasExpiration(paymentReference: PaymentReference): boolean {
    return Boolean(paymentReference.expiresOn && paymentReference.expiresOn !== '--/----');
  }
}
