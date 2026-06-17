import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Patient } from '../../../domain/model/patient.entity';
import { UpdatePatientContactCommand } from '../../../domain/model/update-patient-contact.command';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';

@Component({
  selector: 'app-patient-contact-edit-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './patient-contact-edit-dialog.html',
  styleUrl: './patient-contact-edit-dialog.scss',
})
export class PatientContactEditDialog extends BaseForm {
  private readonly translate = inject(TranslateService);
  private initializedPatientId: string | null = null;
  private wasVisible = false;

  visible = model.required<boolean>();
  patient = input<Patient | null>(null);
  pending = input<boolean>(false);

  readonly save = output<UpdatePatientContactCommand>();
  readonly closed = output<void>();

  protected readonly countryOptions = computed<CountryPhoneOption[]>(() =>
    buildCountryPhoneOptions(this.translate),
  );
  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    countryCode: new FormControl('+51', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    medicalCondition: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    super();

    effect(() => {
      const patient = this.patient();
      const isVisible = this.visible();
      if (!patient || !isVisible) {
        this.wasVisible = false;
        this.initializedPatientId = null;
        return;
      }

      const shouldInitialize = !this.wasVisible || this.initializedPatientId !== patient.id;
      if (!shouldInitialize) return;

      this.wasVisible = true;
      this.initializedPatientId = patient.id;

      this.form.reset(
        {
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          countryCode: patient.countryCode,
          phoneNumber: patient.phoneNumber,
          medicalCondition: patient.medicalCondition,
        },
        { emitEvent: false },
      );
      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  protected onSave(): void {
    if (this.pending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit(
      new UpdatePatientContactCommand({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        countryCode: value.countryCode,
        phoneNumber: value.phoneNumber,
        medicalCondition: value.medicalCondition,
      }),
    );
  }

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
    if (!visible) {
      this.closed.emit();
    }
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }
}
