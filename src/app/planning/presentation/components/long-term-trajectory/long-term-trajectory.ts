import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ClinicalTrajectory} from '../../../domain/model/clinical-trajectory';

/**
 * Bottom card of the Therapy Roadmap showing the long-term recovery
 * trajectory: a chart placeholder with a "current point" pin and three
 * stat tiles (estimated RTP, compliance, risk). Pure visual — fed by
 * a ClinicalTrajectory snapshot.
 */
@Component({
  selector: 'app-long-term-trajectory',
  imports: [TranslatePipe],
  templateUrl: './long-term-trajectory.html',
  styleUrl: './long-term-trajectory.scss'
})
export class LongTermTrajectory {
  trajectory = input.required<ClinicalTrajectory>();

  protected readonly riskBars = computed(() => {
    const filledByLevel = {low: 1, medium: 2, high: 4} as const;
    const filled = filledByLevel[this.trajectory().riskLevel];
    return [0, 1, 2, 3].map(i => i < filled);
  });
}
