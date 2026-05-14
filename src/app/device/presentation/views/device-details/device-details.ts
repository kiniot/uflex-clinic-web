import {Component, computed, effect, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {DeviceStore} from '../../../application/device.store';
import {DeviceStatus} from '../../../domain/model/device.types';

interface SelectOption<T> {
  label: string;
  value: T;
}

/**
 * Device Details view for editing a single IoT kit's status.
 */
@Component({
  selector: 'app-device-details',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    SelectModule,
    PageHeader
  ],
  templateUrl: './device-details.html',
  styleUrl: './device-details.scss'
})
export class DeviceDetails extends BaseForm {
  private readonly store = inject(DeviceStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  protected readonly deviceId = computed(() => Number(this.paramMap().get('id')));
  protected readonly device = computed(() =>
    this.store.devices().find(device => device.id === this.deviceId())
  );

  form = new FormGroup({
    status: new FormControl<DeviceStatus | null>(null, {
      validators: [Validators.required]
    })
  });

  private readonly statusLabels = toSignal(
    this.translate.stream([
      'deviceManagement.status.online',
      'deviceManagement.status.idle',
      'deviceManagement.status.offline'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected readonly statusOptions = computed<SelectOption<DeviceStatus>[]>(() => [
    {
      label: this.statusLabels()['deviceManagement.status.online'] ?? '',
      value: 'online'
    },
    {
      label: this.statusLabels()['deviceManagement.status.idle'] ?? '',
      value: 'idle'
    },
    {
      label: this.statusLabels()['deviceManagement.status.offline'] ?? '',
      value: 'offline'
    }
  ]);

  constructor() {
    super();
    effect(() => {
      const device = this.device();
      if (!device) return;
      this.form.controls.status.setValue(device.status, {emitEvent: false});
    });
  }

  protected onCancel() {
    this.router.navigate(['/clinic-admin/device']);
  }

  protected onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const device = this.device();
    if (!device) return;

    const status = this.form.getRawValue().status;
    if (!status) return;

    this.store.updateDeviceStatus(device.id, status);
    this.router.navigate(['/clinic-admin/device']);
  }
}

