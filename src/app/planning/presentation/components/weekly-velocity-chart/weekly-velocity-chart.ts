import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Stylized bar chart used by the dashboard's Clinical Summary card.
 * Each bar is one rehab day; height is a 0–100 percentage. Pure visual
 * component — fed by ClinicalMetrics.weeklyVelocityBars.
 */
@Component({
  selector: 'app-weekly-velocity-chart',
  imports: [TranslatePipe],
  templateUrl: './weekly-velocity-chart.html',
  styleUrl: './weekly-velocity-chart.scss'
})
export class WeeklyVelocityChart {
  bars = input.required<number[]>();
}
