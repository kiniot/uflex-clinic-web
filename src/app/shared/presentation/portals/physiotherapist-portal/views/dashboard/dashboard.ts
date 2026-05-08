import {DecimalPipe} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {PlanningStore} from '../../../../../../planning/application/planning.store';
import {ClinicalAlert} from '../../../../../../planning/domain/model/clinical-alert.entity';
import {AlertAction} from '../../../../../../planning/domain/model/clinical-alert.types';
import {Session} from '../../../../../../planning/domain/model/session.entity';
import {DailyScheduleTable} from '../../../../../../planning/presentation/components/daily-schedule-table/daily-schedule-table';
import {UrgentAlertsFeed} from '../../../../../../planning/presentation/components/urgent-alerts-feed/urgent-alerts-feed';
import {WeeklyVelocityChart} from '../../../../../../planning/presentation/components/weekly-velocity-chart/weekly-velocity-chart';

/**
 * Physiotherapist dashboard. Cross-context aggregator that pulls
 * scheduling, alerts, and clinical-summary metrics from the Planning
 * store and lays them out as the clinician's daily landing page.
 */
@Component({
  selector: 'app-dashboard',
  imports: [
    DecimalPipe,
    TranslatePipe,
    AvatarModule,
    ButtonModule,
    DailyScheduleTable,
    UrgentAlertsFeed,
    WeeklyVelocityChart
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly planning = inject(PlanningStore);

  protected readonly metrics = this.planning.metrics;
  protected readonly sessions = this.planning.dailySessions;
  protected readonly alerts = this.planning.alerts;
  protected readonly patientsPreview = computed(() => this.planning.patients().slice(0, 2));

  protected onRegisterPatient() { console.log('Register new patient'); }
  protected onViewFullCalendar() { console.log('View full calendar'); }
  protected onSummaryAction() { console.log('Open clinical summary detail'); }

  protected onSessionOpen(session: Session) {
    console.log('Open session detail', session.timeLabel, session.patientName);
  }

  protected onAlertAction(event: {alert: ClinicalAlert; action: AlertAction}) {
    console.log('Alert action', event.action.label, 'for', event.alert.patientName);
  }
}
