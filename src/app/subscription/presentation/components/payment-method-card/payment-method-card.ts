import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subscription } from '../../../domain/models/subscription';

/**
 * Internal visual card for displaying the saved payment method reference.
 */
@Component({
  selector: 'app-payment-method-card',
  imports: [ButtonModule, CardModule],
  templateUrl: './payment-method-card.html',
  styleUrl: './payment-method-card.scss',
})
export class PaymentMethodCard {
  subscription = input.required<Subscription | null>();
  updateRequested = output<void>();
}
