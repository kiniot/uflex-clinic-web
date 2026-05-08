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
import {Device} from '../../../domain/model/device.entity';
import {LinkPatientCommand} from '../../../domain/model/link-patient.command';
import {PlanningStore} from '../../../../planning/application/planning.store';
import {Patient} from '../../../../planning/domain/model/patient.entity';

interface DeviceOption {
  label: string;
  value: number;
}

/**
 * Link IoT Device view inside the Device bounded context. Lets a clinician
 * select a patient (from the Planning bounded context) and assign one of
 * the available uFlex devices. Emits a LinkPatientCommand on confirm and
 * routes back to the inventory.
 */
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
  private planningStore = inject(PlanningStore);

  protected readonly patients = this.planningStore.patients;

  protected readonly filterText = signal('');
  protected readonly selectedPatientId = signal<number | null>(null);
  protected readonly selectedDeviceId = signal<number | null>(null);

  protected readonly filteredPatients = computed<Patient[]>(() => {
    const term = this.filterText().trim().toLowerCase();
    if (!term) return this.patients();
    return this.patients().filter(p =>
      p.name.toLowerCase().includes(term) || p.mrn.toLowerCase().includes(term)
    );
  });

  protected readonly availableDevices = computed<Device[]>(() =>
    this.deviceStore.devices().filter(d => d.linkedPatient === null && d.status !== 'offline')
  );

  protected readonly deviceOptions = computed<DeviceOption[]>(() =>
    this.availableDevices().map(d => ({label: d.kitId, value: d.id}))
  );

  protected readonly selectedPatient = computed<Patient | null>(() => {
    const id = this.selectedPatientId();
    return id != null ? this.patients().find(p => p.id === id) ?? null : null;
  });

  protected readonly selectedDevice = computed<Device | null>(() => {
    const id = this.selectedDeviceId();
    return id != null ? this.deviceStore.devices().find(d => d.id === id) ?? null : null;
  });

  protected readonly canConfirm = computed(() =>
    this.selectedPatient() !== null && this.selectedDevice() !== null
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
    this.selectedPatient()?.name ?? this.translations()['deviceLink.unselectedPatient'] ?? ''
  );

  protected readonly assignedKitLabel = computed(() =>
    this.selectedDevice()?.kitId ?? this.translations()['deviceLink.unselectedKit'] ?? ''
  );

  protected onSelectPatient(patient: Patient) {
    this.selectedPatientId.set(patient.id);
  }

  protected onCancel() {
    this.router.navigate(['/clinic-admin/device']);
  }

  protected onConfirm() {
    const patient = this.selectedPatient();
    const device = this.selectedDevice();
    if (!patient || !device) return;

    const command = new LinkPatientCommand({
      patientId: patient.id,
      deviceId: device.id,
      protocolDuration: this.protocolDuration()
    });
    console.log('Link patient command', command);
    this.router.navigate(['/clinic-admin/device']);
  }
}
