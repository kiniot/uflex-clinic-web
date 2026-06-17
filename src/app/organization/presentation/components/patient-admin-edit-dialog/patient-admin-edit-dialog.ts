import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';
import { Patient } from '../../../domain/model/patient.entity';
import { UpdatePatientByClinicAdminCommand } from '../../../domain/model/update-patient-by-clinic-admin.command';
import { PatientGender } from '../../../domain/model/patient.types';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-patient-admin-edit-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './patient-admin-edit-dialog.html',
  styleUrl: './patient-admin-edit-dialog.scss',
})
export class PatientAdminEditDialog extends BaseForm {
  private readonly translate = inject(TranslateService);
  private initializedPatientId: string | null = null;
  private wasVisible = false;

  visible = model.required<boolean>();
  patient = input<Patient | null>(null);
  pending = input<boolean>(false);

  readonly save = output<UpdatePatientByClinicAdminCommand>();
  readonly closed = output<void>();

  protected readonly genderOptions = computed<SelectOption<PatientGender>[]>(() => [
    {
      label: this.translate.instant('registerPatientView.genderOptions.MALE'),
      value: 'MALE',
    },
    {
      label: this.translate.instant('registerPatientView.genderOptions.FEMALE'),
      value: 'FEMALE',
    },
  ]);
  protected readonly countryPhoneOptions = computed<CountryPhoneOption[]>(() =>
    buildCountryPhoneOptions(this.translate),
  );

  protected readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dni: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{8,12}$/)],
    }),
    birthDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl<PatientGender>('MALE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    countryCode: new FormControl('+51', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
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
          dni: patient.dni,
          birthDate: patient.birthDate,
          gender: patient.gender as PatientGender,
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

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
    if (!visible) {
      this.closed.emit();
    }
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryPhoneOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }

  protected onSave(): void {
    const patient = this.patient();
    if (!patient || this.pending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit(
      new UpdatePatientByClinicAdminCommand({
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        dni: value.dni.trim(),
        birthDate: value.birthDate,
        gender: value.gender,
        email: value.email.trim(),
        countryCode: value.countryCode.trim(),
        phoneNumber: value.phoneNumber.trim(),
        medicalCondition: value.medicalCondition.trim(),
        assignedPhysiotherapistId: patient.assignedPhysiotherapistId,
      }),
    );
  }
}
