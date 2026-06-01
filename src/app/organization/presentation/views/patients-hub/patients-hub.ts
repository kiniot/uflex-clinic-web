import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../application/organization.store';
import { Patient } from '../../../domain/model/patient.entity';

@Component({
  selector: 'app-patients-hub',
  imports: [TranslatePipe, ButtonModule],
  templateUrl: './patients-hub.html',
  styleUrl: './patients-hub.scss',
})
export class PatientsHub implements OnInit {
  private readonly store = inject(OrganizationStore);
  private readonly router = inject(Router);

  protected readonly clinic = this.store.currentClinic;
  protected readonly physiotherapist = this.store.currentPhysiotherapist;
  protected readonly patients = this.store.patients;
  protected readonly isLoadingPatients = this.store.isLoadingPatients;
  protected readonly inTreatmentPatientsCount = this.store.inTreatmentPatientsCount;

  protected readonly loadingRows = [0, 1, 2, 3];

  ngOnInit(): void {
    void this.store.loadCurrentClinicOnce();
    void this.store.loadCurrentPhysiotherapistOnce();
    void this.store.loadMyPatients();
  }

  protected onRegisterPatient() {
    void this.router.navigate(['/physiotherapist/patients/new']);
  }

  protected onOpenPatient(patient: Patient) {
    void this.router.navigate(['/physiotherapist/patients', patient.id]);
  }
}
