import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {DiagnosticPhase} from '../../../domain/model/diagnostics.types';

/**
 * Live scan card for the diagnostics view: shows the percentage, ETA,
 * a progress bar, and the four ordered phases of the scan.
 */
@Component({
  selector: 'app-diagnostic-progress',
  imports: [TranslatePipe],
  templateUrl: './diagnostic-progress.html',
  styleUrl: './diagnostic-progress.scss'
})
export class DiagnosticProgress {
  progressPct = input.required<number>();
  estimatedRemaining = input.required<string>();
  phases = input.required<DiagnosticPhase[]>();
}
