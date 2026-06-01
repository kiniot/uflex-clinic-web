import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../application/organization.store';
import { PlanningStore } from '../../../../planning/application/planning.store';

@Component({
  selector: 'app-patient-detail',
  imports: [DatePipe, RouterLink, RouterOutlet, TranslatePipe, ButtonModule],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
})
export class PatientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);

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
    void this.organizationStore.dischargePatient(patientId);
  }
}
