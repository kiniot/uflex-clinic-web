import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RegistrationStep} from '../../../domain/model/registration.types';

/**
 * Live session tracker shown alongside the device registration form.
 * Each step renders with its current status (in-progress / pending /
 * complete) and a progress bar at the bottom shows overall advancement.
 */
@Component({
  selector: 'app-registration-status',
  imports: [TranslatePipe],
  templateUrl: './registration-status.html',
  styleUrl: './registration-status.scss'
})
export class RegistrationStatus {
  steps = input.required<RegistrationStep[]>();

  protected readonly currentStepIndex = computed(() => {
    const steps = this.steps();
    const inProgress = steps.findIndex(s => s.status === 'in-progress');
    if (inProgress >= 0) return inProgress;
    const completed = steps.filter(s => s.status === 'complete').length;
    return Math.min(completed, steps.length - 1);
  });

  protected readonly progress = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) return 0;
    const completed = steps.filter(s => s.status === 'complete').length;
    const inProgressBoost = steps.some(s => s.status === 'in-progress') ? 0.5 : 0;
    return Math.round(((completed + inProgressBoost) / steps.length) * 100);
  });
}
