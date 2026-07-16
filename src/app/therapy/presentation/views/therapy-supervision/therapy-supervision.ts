import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { Patient } from '../../../../organization/domain/model/patient.entity';
import { TherapySessionResource } from '../../../infrastructure/therapy-session.response';
import { TherapyApi } from '../../../infrastructure/therapy-api';
import { TherapyDashboardBase, TherapyRoleContext } from '../shared/therapy-dashboard.base';

interface ClinicSessionSnapshot {
  patient: Patient;
  session: TherapySessionResource;
}

@Component({
  selector: 'app-therapy-supervision',
  imports: [TranslatePipe, ButtonModule, DatePipe],
  templateUrl: './therapy-supervision.html',
  styleUrl: './therapy-supervision.scss',
})
export class TherapySupervision extends TherapyDashboardBase implements OnInit {
  protected readonly roleContext: TherapyRoleContext = 'admin';

  private readonly therapyApi = inject(TherapyApi);
  private readonly clinicSessionsSignal = signal<ClinicSessionSnapshot[]>([]);
  private readonly loadingClinicSessionsSignal = signal(false);

  protected readonly clinicSessions = this.clinicSessionsSignal.asReadonly();
  protected readonly isLoadingClinicSessions = this.loadingClinicSessionsSignal.asReadonly();
  protected readonly activeSessionsCount = computed(() => this.clinicSessions().length);
  protected readonly sessionsRequiringReviewCount = computed(
    () => this.clinicSessions().filter((item) => item.session.requiresClinicalReview).length,
  );
  protected readonly activeDevicesCount = computed(
    () => this.deviceStore.devices().filter((device) => !device.offline && device.status !== 'RETIRED').length,
  );
  protected readonly highlightedSessions = computed(() =>
    [...this.clinicSessions()].sort((left, right) => {
      if (left.session.requiresClinicalReview && !right.session.requiresClinicalReview) return -1;
      if (!left.session.requiresClinicalReview && right.session.requiresClinicalReview) return 1;
      return (right.session.startedAt ?? '').localeCompare(left.session.startedAt ?? '');
    }),
  );

  async ngOnInit(): Promise<void> {
    await this.initializeDashboard();
    await this.loadClinicSessions();
  }

  protected override onSelectPatient(patient: Patient) {
    super.onSelectPatient(patient);
  }

  protected override onRefreshPatientContext() {
    super.onRefreshPatientContext();
    void this.loadClinicSessions();
  }

  protected sessionFeedDeviceLabel(session: TherapySessionResource): string {
    const device = this.deviceForSerial(session.iotDeviceId);
    return device ? this.deviceDisplayLabel(device) : 'therapySessions.hardwareDeviceLinked';
  }

  private async loadClinicSessions(): Promise<void> {
    this.loadingClinicSessionsSignal.set(true);
    try {
      const results = await Promise.allSettled(
        this.patients().map(async (patient) => ({
          patient,
          session: await firstValueFrom(this.therapyApi.getActiveByPatientId(patient.id)),
        })),
      );

      const sessions = results
        .filter((result): result is PromiseFulfilledResult<ClinicSessionSnapshot> => result.status === 'fulfilled')
        .map((result) => result.value);

      this.clinicSessionsSignal.set(sessions);
    } finally {
      this.loadingClinicSessionsSignal.set(false);
    }
  }
}
