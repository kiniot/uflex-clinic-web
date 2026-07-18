import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type KpiTone = 'neutral' | 'good' | 'warn' | 'danger';

export interface TrackingKpi {
  labelKey: string;
  value: string;
  hint: string;
  tone: KpiTone;
}

/**
 * The four numbers that frame a patient's therapy, as one dense strip.
 *
 * <p>Purpose-built rather than four generic stat cards: these want a shared baseline, a tone that
 * carries clinical meaning (a poor good-repetition ratio should look wrong at a glance), and enough
 * vertical restraint that the session table stays on screen alongside them.
 */
@Component({
  selector: 'app-tracking-kpis',
  imports: [TranslatePipe],
  templateUrl: './tracking-kpis.html',
  styleUrl: './tracking-kpis.scss',
})
export class TrackingKpis {
  readonly kpis = input.required<TrackingKpi[]>();
}
