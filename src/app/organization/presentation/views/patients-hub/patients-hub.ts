import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OrganizationStore } from '../../../application/organization.store';
import { Patient } from '../../../domain/model/patient.entity';
import { ConfirmActionDialog } from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import { PatientContactEditDialog } from '../../components/patient-contact-edit-dialog/patient-contact-edit-dialog';
import { UpdatePatientContactCommand } from '../../../domain/model/update-patient-contact.command';

@Component({
  selector: 'app-patients-hub',
  imports: [
    TranslatePipe,
    ButtonModule,
    TooltipModule,
    ConfirmActionDialog,
    PatientContactEditDialog,
  ],
  templateUrl: './patients-hub.html',
  styleUrl: './patients-hub.scss',
})
export class PatientsHub implements OnInit {
  private readonly store = inject(OrganizationStore);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  protected readonly clinic = this.store.currentClinic;
  protected readonly physiotherapist = this.store.currentPhysiotherapist;
  protected readonly patients = this.store.patients;
  protected readonly isLoadingPatients = this.store.isLoadingPatients;
  protected readonly inTreatmentPatientsCount = this.store.inTreatmentPatientsCount;
  protected readonly isUpdatingPatient = this.store.isUpdatingPatient;
  protected readonly isDeletingPatient = this.store.isDeletingPatient;
  protected readonly isEditDialogVisible = signal(false);
  protected readonly selectedPatientForEdit = signal<Patient | null>(null);
  protected readonly isDeleteDialogVisible = signal(false);
  protected readonly selectedPatientForDelete = signal<Patient | null>(null);

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

  protected onEditPatient(patient: Patient) {
    this.selectedPatientForEdit.set(patient);
    this.isEditDialogVisible.set(true);
  }

  protected closeEditPatientDialog() {
    this.isEditDialogVisible.set(false);
    this.selectedPatientForEdit.set(null);
  }

  protected async savePatientEdit(command: UpdatePatientContactCommand) {
    const patient = this.selectedPatientForEdit();
    if (!patient) return;

    try {
      await this.store.updatePatientAsPhysiotherapist(patient.id, command);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientsList.notifications.editSuccessSummary'),
        detail: this.translate.instant('patientsList.notifications.editSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
      this.closeEditPatientDialog();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientsList.notifications.editErrorSummary'),
        detail: this.translate.instant('patientsList.notifications.editErrorDetail'),
        life: 4500,
      });
    }
  }

  protected onRequestDeletePatient(patient: Patient) {
    this.selectedPatientForDelete.set(patient);
    this.isDeleteDialogVisible.set(true);
  }

  protected closeDeleteDialog() {
    if (this.isDeletingPatient()) return;
    this.isDeleteDialogVisible.set(false);
    this.selectedPatientForDelete.set(null);
  }

  protected async confirmDeletePatient() {
    const patient = this.selectedPatientForDelete();
    if (!patient) return;

    try {
      await this.store.deletePatient(patient.id);
      this.isDeleteDialogVisible.set(false);
      this.selectedPatientForDelete.set(null);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('patientsList.notifications.deleteSuccessSummary'),
        detail: this.translate.instant('patientsList.notifications.deleteSuccessDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('patientsList.notifications.deleteErrorSummary'),
        detail: this.translate.instant('patientsList.notifications.deleteErrorDetail'),
        life: 4500,
      });
    }
  }
}
