import {Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ConfirmActionDialog} from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import {DeviceStore} from '../../../application/device.store';
import {OrganizationStore} from '../../../../organization/application/organization.store';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-device-details',
  imports: [
    RouterLink,
    TranslatePipe,
    ButtonModule,
    DialogModule,
    SelectModule,
    FormsModule,
    ToastModule,
    PageHeader,
    ConfirmActionDialog
  ],
  providers: [MessageService],
  templateUrl: './device-details.html',
  styleUrl: './device-details.scss'
})
export class DeviceDetails {
  private readonly store = inject(DeviceStore);
  private readonly orgStore = inject(OrganizationStore);
  private readonly iamStore = inject(IamStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  protected readonly serialNumber = computed(() => String(this.paramMap().get('serialNumber')));
  protected readonly device = computed(() =>
    this.store.devices().find(device => device.serialNumber === this.serialNumber())
  );

  private readonly isPhysiotherapist = computed(() =>
    this.iamStore.currentRoles().includes('ROLE_PHYSIOTHERAPIST')
  );

  /* Confirm dialog state */
  protected readonly confirmDialogVisible = signal(false);
  protected readonly confirmDialogTitleKey = signal('');
  protected readonly confirmDialogMessageKey = signal('');
  protected readonly confirmDialogIconClass = signal('pi pi-question-circle');
  protected readonly confirmDialogTone = signal<'primary' | 'danger'>('primary');
  protected readonly confirmDialogActionLabelKey = signal('');
  protected readonly confirmDialogPending = signal(false);

  /* Assign patient dialog */
  protected readonly assignDialogVisible = signal(false);
  protected readonly selectedPatientId = signal<string | null>(null);
  protected readonly isAssigning = signal(false);

  protected readonly patientOptions = computed(() => {
    const assignedIds = this.assignedPatientIds();
    const byPhysio = this.orgStore.patientsByPhysiotherapist();
    if (byPhysio.length > 0) {
      return byPhysio
        .filter(p => !assignedIds.has(p.id))
        .map(p => ({label: p.fullName, value: p.id}));
    }
    return this.orgStore.patients()
      .filter(p => !assignedIds.has(p.id))
      .map(p => ({label: p.fullName, value: p.id}));
  });

  private readonly assignedPatientIds = computed(() =>
    new Set(
      this.store.devices()
        .filter(d => d.currentPatientId != null)
        .map(d => d.currentPatientId!)
    )
  );

  /* Contextual action visibility */

  /** Show "Assign Patient" when device is AVAILABLE with VALID calibration */
  protected readonly canAssign = computed(() => {
    const d = this.device();
    return d?.status === 'AVAILABLE' && d?.calibrationStatus === 'VALID';
  });

  /** Show "Unassign Patient" when device is ASSIGNED */
  protected readonly canUnassign = computed(() => {
    return this.device()?.status === 'ASSIGNED';
  });

  /** Show "Mark for Calibration" when device is NOT already needing it and NOT retired */
  protected readonly canMarkNeedsCalibration = computed(() => {
    const d = this.device();
    return d != null && d.calibrationStatus !== 'NEEDS_CALIBRATION' && d.status !== 'RETIRED';
  });

  /** Show "Validate Calibration" when device needs calibration */
  protected readonly canValidateCalibration = computed(() => {
    return this.device()?.calibrationStatus === 'NEEDS_CALIBRATION';
  });

  /* Navigation */

  protected onCancel() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  /* Assign Patient flow (Option B: inline dialog) */

  protected async onOpenAssignDialog() {
    if (this.isPhysiotherapist()) {
      const physio = await this.orgStore.loadCurrentPhysiotherapistOnce();
      if (physio) {
        await this.orgStore.loadPatientsByPhysiotherapistId(physio.id);
      }
    } else {
      await this.orgStore.loadClinicPatients();
    }
    this.selectedPatientId.set(null);
    this.assignDialogVisible.set(true);
  }

  protected onConfirmAssign() {
    const patientId = this.selectedPatientId();
    const device = this.device();
    if (!patientId || !device) return;

    this.isAssigning.set(true);
    this.store.assignDevice(device.serialNumber, patientId).subscribe({
      next: () => {
        this.isAssigning.set(false);
        this.assignDialogVisible.set(false);
        this.messageService.add({severity: 'success', summary: 'Paciente asignado', detail: `Dispositivo asignado exitosamente`});
      },
      error: () => {
        this.isAssigning.set(false);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo asignar el paciente al dispositivo'});
      }
    });
  }

  /* Unassign Patient flow */

  protected onOpenUnassignConfirm() {
    this.confirmDialogTitleKey.set('deviceDetails.confirm.unassignPatient.title');
    this.confirmDialogMessageKey.set('deviceDetails.confirm.unassignPatient.body');
    this.confirmDialogIconClass.set('pi pi-user-minus');
    this.confirmDialogTone.set('danger');
    this.confirmDialogActionLabelKey.set('deviceDetails.confirm.unassignPatient.confirm');
    this.confirmDialogVisible.set(true);
  }

  /* Calibration flows */

  protected onOpenMarkNeedsCalibrationConfirm() {
    this.confirmDialogTitleKey.set('deviceDetails.confirm.markNeedsCalibration.title');
    this.confirmDialogMessageKey.set('deviceDetails.confirm.markNeedsCalibration.body');
    this.confirmDialogIconClass.set('pi pi-exclamation-triangle');
    this.confirmDialogTone.set('primary');
    this.confirmDialogActionLabelKey.set('deviceDetails.confirm.markNeedsCalibration.confirm');
    this.confirmDialogVisible.set(true);
  }

  protected onOpenValidateCalibrationConfirm() {
    this.confirmDialogTitleKey.set('deviceDetails.confirm.validateCalibration.title');
    this.confirmDialogMessageKey.set('deviceDetails.confirm.validateCalibration.body');
    this.confirmDialogIconClass.set('pi pi-check-circle');
    this.confirmDialogTone.set('primary');
    this.confirmDialogActionLabelKey.set('deviceDetails.confirm.validateCalibration.confirm');
    this.confirmDialogVisible.set(true);
  }

  /* Confirm action handler */

  protected onConfirmAction() {
    const device = this.device();
    if (!device) return;

    const actionKey = this.confirmDialogActionLabelKey();

    if (actionKey === 'deviceDetails.confirm.unassignPatient.confirm') {
      this.confirmDialogPending.set(true);
      this.store.unassignDevice(device.serialNumber);
      this.confirmDialogPending.set(false);
      this.confirmDialogVisible.set(false);
      this.messageService.add({severity: 'success', summary: 'Paciente desvinculado', detail: `Paciente desvinculado del dispositivo`});
    } else if (actionKey === 'deviceDetails.confirm.markNeedsCalibration.confirm') {
      this.confirmDialogPending.set(true);
      this.store.calibrateDevice(device.serialNumber, 'needs_calibration');
      this.confirmDialogPending.set(false);
      this.confirmDialogVisible.set(false);
      this.messageService.add({severity: 'success', summary: 'Marcado para calibración', detail: `Dispositivo marcado para calibración`});
    } else if (actionKey === 'deviceDetails.confirm.validateCalibration.confirm') {
      this.confirmDialogPending.set(true);
      this.store.calibrateDevice(device.serialNumber, 'validate');
      this.confirmDialogPending.set(false);
      this.confirmDialogVisible.set(false);
      this.messageService.add({severity: 'success', summary: 'Calibración validada', detail: `Calibración del dispositivo validada`});
    }
  }

  protected onCloseDialog() {
    this.confirmDialogVisible.set(false);
  }
}
