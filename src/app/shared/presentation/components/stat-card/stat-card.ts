import {Component, input} from '@angular/core';

/**
 * Generic statistic card with an uppercase title and a slot for the body
 * (numbers, badges, progress bars). Each consumer composes its own body via
 * <ng-content/> so the card stays role- and domain-agnostic.
 */
@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCard {
  title = input.required<string>();
}
