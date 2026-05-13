import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentMethod} from '../../../domain/model/payment-method.entity';

/**
 * Visual credit card representation of the clinic's payment method.
 * Renders the masked number, holder, and expiry date over a dark teal
 * gradient background.
 */
@Component({
  selector: 'app-payment-card',
  imports: [TranslatePipe],
  templateUrl: './payment-card.html',
  styleUrl: './payment-card.scss'
})
export class PaymentCard {
  paymentMethod = input.required<PaymentMethod>();
}
