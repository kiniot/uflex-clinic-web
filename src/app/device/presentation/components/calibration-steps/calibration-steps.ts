import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {CalibrationStep} from '../../../domain/model/calibration.types';

/**
 * Renders the ordered list of calibration steps. Each step shows a status
 * icon (completed / active / pending), a title, a description, and — when
 * active — a thin progress bar indicating in-flight progress.
 */
@Component({
  selector: 'app-calibration-steps',
  imports: [TranslatePipe],
  templateUrl: './calibration-steps.html',
  styleUrl: './calibration-steps.scss'
})
export class CalibrationSteps {
  steps = input.required<CalibrationStep[]>();
}
