import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {RegisterDeviceCommand} from '../../../domain/model/register-device.command';
import {RegistrationStep} from '../../components/registration-status/registration-status';
import {RegistrationStatus} from '../../components/registration-status/registration-status';
import {DeviceStore} from '../../../application/device.store';

@Component({
  selector: 'app-register-device',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RegistrationStatus
  ],
  providers: [MessageService],
  templateUrl: './register-device.html',
  styleUrl: './register-device.scss'
})
export class RegisterDevice extends BaseForm {
  private router = inject(Router);
  private store = inject(DeviceStore);
  private messageService = inject(MessageService);

  protected readonly isRegistering = signal(false);

  protected readonly steps = signal<RegistrationStep[]>([
    {id: 'form-validation', label: 'deviceRegister.steps.formValidation', status: 'in-progress'},
    {id: 'database-sync', label: 'deviceRegister.steps.databaseSync', status: 'pending'},
    {id: 'iot-key-exchange', label: 'deviceRegister.steps.iotKeyExchange', status: 'pending'}
  ]);

  form = new FormGroup({
    serialNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    macAddress: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    model: new FormControl<string | null>(null),
    firmwareVersion: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  protected onOpenScanner() {
    this.messageService.add({severity: 'info', summary: 'QR Scanner', detail: 'Scanner feature coming soon'});
  }

  protected onDiscard() {
    this.router.navigate(['/clinic-admin/device']);
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isRegistering.set(true);
    this.steps.update(steps => steps.map(s => ({...s, status: s.id === 'database-sync' ? 'in-progress' : s.status})));

    const value = this.form.getRawValue();
    const command: RegisterDeviceCommand = {
      serialNumber: value.serialNumber,
      macAddress: value.macAddress,
      firmwareVersion: value.firmwareVersion,
      model: value.model ?? undefined
    };

    try {
      await this.store.registerDevice(command);
      this.messageService.add({severity: 'success', summary: 'Dispositivo registrado', detail: `Kit ${command.serialNumber} registrado exitosamente`});
      this.router.navigate(['/clinic-admin/device']);
    } catch {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo registrar el dispositivo'});
      this.isRegistering.set(false);
      this.steps.update(steps => steps.map(s => ({...s, status: s.id === 'form-validation' ? 'pending' : s.status})));
    }
  }
}
