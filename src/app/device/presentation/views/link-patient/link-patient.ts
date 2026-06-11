import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {SearchInput} from '../../../../shared/presentation/components/search-input/search-input';
import {DeviceStore} from '../../../application/device.store';
import {AssignDeviceCommand} from '../../../domain/model/assign-device.command';
import {Patient, DeviceOption} from './link-patient.types';

@Component({
  selector: 'app-link-patient',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    SearchInput
  ],
  templateUrl: './link-patient.html',
  styleUrl: './link-patient.scss'
})
export class LinkPatient {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private deviceStore = inject(DeviceStore);

  protected readonly filterText = signal('');
  protected readonly selectedPatientId = signal<string | null>(null);
  protected readonly selectedDeviceId = signal<string | null>(null);

  protected readonly deviceOptions = computed<DeviceOption[]>(() =>
    this.deviceStore.devices()
      .filter(d => d.currentPatientId === null && d.status === 'AVAILABLE')
      .map(d => ({label: d.serialNumber, value: d.serialNumber}))
  );

  protected readonly filteredPatients = computed<Patient[]>(() => {
    return [];
  });

  protected readonly selectedDevice = computed<{serialNumber: string} | null>(() => {
    const id = this.selectedDeviceId();
    return id != null ? {serialNumber: id} : null;
  });

  protected readonly canConfirm = computed(() =>
    this.selectedPatientId() !== null && this.selectedDeviceId() !== null
  );

  private readonly translations = toSignal(
    this.translate.stream([
      'deviceLink.protocolDurationDefault',
      'deviceLink.unselectedPatient',
      'deviceLink.unselectedKit'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected readonly protocolDuration = computed(() =>
    this.translations()['deviceLink.protocolDurationDefault'] ?? ''
  );

  protected readonly assignedPatientLabel = computed(() =>
    this.translations()['deviceLink.unselectedPatient'] ?? ''
  );

  protected readonly assignedKitLabel = computed(() =>
    this.selectedDevice()?.serialNumber ?? this.translations()['deviceLink.unselectedKit'] ?? ''
  );

  protected onSelectPatient(patient: Patient) {
    this.selectedPatientId.set(patient.id);
  }

  protected onCancel() {
    this.router.navigate(['/clinic-admin/device']);
  }

  protected onConfirm() {
    const patientId = this.selectedPatientId();
    const serialNumber = this.selectedDeviceId();
    if (!patientId || !serialNumber) return;

    this.deviceStore.assignDevice(serialNumber, patientId);
    this.router.navigate(['/clinic-admin/device']);
  }
}