import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Subscription } from '../../../domain/models/subscription';

/**
 * Internal visual card for the clinic's current Subscription status.
 */
@Component({
  selector: 'app-current-subscription-card',
  imports: [CardModule, TagModule, DatePipe],
  templateUrl: './current-subscription-card.html',
  styleUrl: './current-subscription-card.scss',
})
export class CurrentSubscriptionCard {
  subscription = input.required<Subscription | null>();

  statusLabel(status: string): string {
    return status.replace('_', ' ');
  }
}
