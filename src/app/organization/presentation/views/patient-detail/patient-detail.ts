import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../application/organization.store';
import { PlanningStore } from '../../../../planning/application/planning.store';

@Component({
  selector: 'app-patient-detail',
  imports: [DatePipe, RouterLink, TranslatePipe, ButtonModule],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
})
export class PatientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private readonly patientId = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly patient = this.organizationStore.selectedPatient;
  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly physiotherapist = this.organizationStore.currentPhysiotherapist;
  protected readonly treatmentPlans = this.planningStore.patientTreatmentPlans;
  protected readonly isLoadingPatient = this.organizationStore.isLoadingSelectedPatient;
  protected readonly isLoadingTreatmentPlans = this.planningStore.isLoadingTreatmentPlans;
  protected readonly isDischargingPatient = this.organizationStore.isDischargingPatient;
  protected readonly loadingRows = [0, 1, 2];

  protected readonly assignedPhysiotherapistLabel = computed(() => {
    const patient = this.patient();
    const physiotherapist = this.physiotherapist();

    if (!patient?.assignedPhysiotherapistId) return '—';
    if (physiotherapist && physiotherapist.id === patient.assignedPhysiotherapistId) {
      return physiotherapist.fullName;
    }

    return patient.assignedPhysiotherapistId;
  });

  protected readonly clinicLabel = computed(() => {
    const clinic = this.clinic();
    const patient = this.patient();
    return clinic?.commercialName ?? clinic?.legalName ?? patient?.clinicId ?? '—';
  });

  constructor() {
    effect(() => {
      const patientId = this.patientId().get('patientId');
      if (!patientId) return;

      void this.organizationStore.loadCurrentClinicOnce();
      void this.organizationStore.loadCurrentPhysiotherapistOnce();
      void this.organizationStore.loadPatientById(patientId);
      void this.planningStore.loadTreatmentPlansByPatient(patientId);
    });
  }

  protected onDischargePatient() {
    const patientId = this.patient()?.id;
    if (!patientId || this.patient()?.status === 'DISCHARGED') return;
    void this.dischargePatient(patientId);
  }

  private async dischargePatient(patientId: string): Promise<void> {
    try {
      await this.organizationStore.dischargePatient(patientId);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientDetail.notifications.dischargeSuccessSummary'),
        detail: this.translate.instant('patientDetail.notifications.dischargeSuccessDetail', {
          name: this.patient()?.fullName ?? '',
        }),
        life: 4000,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientDetail.notifications.dischargeErrorSummary'),
        detail: this.translate.instant('patientDetail.notifications.dischargeErrorDetail'),
        life: 4500,
      });
    }
  }
}
