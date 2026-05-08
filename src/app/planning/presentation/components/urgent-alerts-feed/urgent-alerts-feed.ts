import {UpperCasePipe} from '@angular/common';
import {Component, input, output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ClinicalAlert} from '../../../domain/model/clinical-alert.entity';
import {AlertAction} from '../../../domain/model/clinical-alert.types';

interface AlertActionEvent {
  alert: ClinicalAlert;
  action: AlertAction;
}

/**
 * Vertical feed of clinical alerts. Each alert renders as a card with a
 * left-edge severity stripe, the patient name + ago label, message body,
 * and one or more action buttons projected from the alert's data. Emits
 * {@link actionInvoked} when the user clicks any action.
 */
@Component({
  selector: 'app-urgent-alerts-feed',
  imports: [UpperCasePipe, ButtonModule],
  templateUrl: './urgent-alerts-feed.html',
  styleUrl: './urgent-alerts-feed.scss'
})
export class UrgentAlertsFeed {
  alerts = input.required<ClinicalAlert[]>();

  readonly actionInvoked = output<AlertActionEvent>();

  protected onAction(alert: ClinicalAlert, action: AlertAction) {
    this.actionInvoked.emit({alert, action});
  }
}
