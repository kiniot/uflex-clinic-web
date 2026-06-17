import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

export interface RegistrationStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'complete';
}

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