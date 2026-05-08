import {Component, input} from '@angular/core';
import {RecoveryPhaseStep} from '../../../domain/model/rehab-program.types';

/**
 * Horizontal four-step indicator for the rehabilitation phases. Each
 * step renders as a numbered circle with its label below; completed
 * steps fill in solid, the active step is highlighted, and upcoming
 * ones stay muted. Connector lines bridge consecutive steps.
 */
@Component({
  selector: 'app-recovery-phase-indicator',
  imports: [],
  templateUrl: './recovery-phase-indicator.html',
  styleUrl: './recovery-phase-indicator.scss'
})
export class RecoveryPhaseIndicator {
  phases = input.required<RecoveryPhaseStep[]>();
}
