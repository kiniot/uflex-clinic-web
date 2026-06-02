import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../application/organization.store';

@Component({
  selector: 'app-physiotherapist-detail',
  imports: [DatePipe, RouterLink, TranslatePipe, ButtonModule],
  templateUrl: './physiotherapist-detail.html',
  styleUrl: './physiotherapist-detail.scss',
})
export class PhysiotherapistDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationStore = inject(OrganizationStore);

  private readonly physiotherapistId = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly physiotherapist = this.organizationStore.selectedPhysiotherapist;
  protected readonly assignedPatients = this.organizationStore.patientsByPhysiotherapist;
  protected readonly isLoadingPhysiotherapist =
    this.organizationStore.isLoadingSelectedPhysiotherapist;
  protected readonly isLoadingPatients = this.organizationStore.isLoadingPatientsByPhysiotherapist;
  protected readonly loadingRows = [0, 1, 2];

  protected readonly activePatientsCount = computed(
    () => this.assignedPatients().filter((patient) => patient.status !== 'DISCHARGED').length,
  );

  constructor() {
    effect(() => {
      const physiotherapistId = this.physiotherapistId().get('physiotherapistId');
      if (!physiotherapistId) return;

      void this.organizationStore.loadCurrentClinicOnce();
      void this.organizationStore.loadClinicPhysiotherapistById(physiotherapistId);
      void this.organizationStore.loadPatientsByPhysiotherapistId(physiotherapistId);
    });
  }
}
