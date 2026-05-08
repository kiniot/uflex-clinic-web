import {Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {RegisterDeviceCommand} from '../../../domain/model/register-device.command';
import {RegistrationStep} from '../../../domain/model/registration.types';
import {RegistrationStatus} from '../../components/registration-status/registration-status';

interface SelectOption<T> {
  label: string;
  value: T;
}

/**
 * View for registering a new uFlex hub. Replaces the Device Inventory
 * content while keeping the admin shell. Submits a RegisterDeviceCommand
 * (logged for now; will POST through the Device API once available) and
 * routes back to the inventory.
 */
@Component({
  selector: 'app-register-device',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RegistrationStatus
  ],
  templateUrl: './register-device.html',
  styleUrl: './register-device.scss'
})
export class RegisterDevice extends BaseForm {
  private translate = inject(TranslateService);
  private router = inject(Router);

  protected readonly steps = signal<RegistrationStep[]>([
    {id: 'form-validation', label: 'Form Validation', status: 'in-progress'},
    {id: 'database-sync', label: 'Database Sync', status: 'pending'},
    {id: 'iot-key-exchange', label: 'IoT Key Exchange', status: 'pending'}
  ]);

  form = new FormGroup({
    kitSerialNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    batchId: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    hardwareVersion: new FormControl<string | null>(null, {validators: [Validators.required]}),
    firmwareVersion: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  private readonly translations = toSignal(
    this.translate.stream([
      'deviceRegister.hardware.versions.flex30',
      'deviceRegister.hardware.versions.flex40',
      'deviceRegister.hardware.versions.flex42'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected hardwareVersionOptions = computed<SelectOption<string>[]>(() => [
    {label: this.translations()['deviceRegister.hardware.versions.flex30'] ?? '', value: 'FlexSense v3.0'},
    {label: this.translations()['deviceRegister.hardware.versions.flex40'] ?? '', value: 'FlexSense v4.0'},
    {label: this.translations()['deviceRegister.hardware.versions.flex42'] ?? '', value: 'FlexSense v4.2'}
  ]);

  protected onOpenScanner() {
    console.log('Open QR scanner');
  }

  protected onDiscard() {
    this.router.navigate(['/clinic-admin/device']);
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const command = new RegisterDeviceCommand({
      kitSerialNumber: value.kitSerialNumber,
      batchId: value.batchId,
      hardwareVersion: value.hardwareVersion!,
      firmwareVersion: value.firmwareVersion
    });

    console.log('Register device command', command);
    this.router.navigate(['/clinic-admin/device']);
  }
}
