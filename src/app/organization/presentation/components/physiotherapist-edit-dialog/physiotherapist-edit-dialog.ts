import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';
import { UpdatePhysiotherapistCommand } from '../../../domain/model/update-physiotherapist.command';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-physiotherapist-edit-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './physiotherapist-edit-dialog.html',
  styleUrl: './physiotherapist-edit-dialog.scss',
})
export class PhysiotherapistEditDialog extends BaseForm {
  private readonly translate = inject(TranslateService);
  private initializedPhysiotherapistId: string | null = null;
  private wasVisible = false;

  visible = model.required<boolean>();
  physiotherapist = input<PhysiotherapistProfile | null>(null);
  pending = input<boolean>(false);

  readonly save = output<UpdatePhysiotherapistCommand>();
  readonly closed = output<void>();

  protected readonly specialtyOptions = computed<SelectOption<string>[]>(() => [
    {
      label: this.translate.instant('organization.physiotherapists.specialties.TRAUMATOLOGICAL'),
      value: 'TRAUMATOLOGICAL',
    },
    {
      label: this.translate.instant('organization.physiotherapists.specialties.NEUROLOGICAL'),
      value: 'NEUROLOGICAL',
    },
    {
      label: this.translate.instant('organization.physiotherapists.specialties.SPORTS'),
      value: 'SPORTS',
    },
    {
      label: this.translate.instant('organization.physiotherapists.specialties.GENERAL'),
      value: 'GENERAL',
    },
  ]);
  protected readonly countryPhoneOptions = computed<CountryPhoneOption[]>(() =>
    buildCountryPhoneOptions(this.translate),
  );

  protected readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    specialty: new FormControl('GENERAL', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    countryCode: new FormControl('+51', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    licenseNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    professionalSummary: new FormControl('', { nonNullable: true }),
    photoUrl: new FormControl('', { nonNullable: true }),
    yearsOfExperience: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  constructor() {
    super();

    effect(() => {
      const physiotherapist = this.physiotherapist();
      const isVisible = this.visible();
      if (!physiotherapist || !isVisible) {
        this.wasVisible = false;
        this.initializedPhysiotherapistId = null;
        return;
      }

      const shouldInitialize =
        !this.wasVisible || this.initializedPhysiotherapistId !== physiotherapist.id;
      if (!shouldInitialize) return;

      this.wasVisible = true;
      this.initializedPhysiotherapistId = physiotherapist.id;

      this.form.reset(
        {
          fullName: physiotherapist.fullName,
          specialty: physiotherapist.specialty,
          email: physiotherapist.email,
          countryCode: physiotherapist.countryCode,
          phoneNumber: physiotherapist.phoneNumber,
          licenseNumber: physiotherapist.licenseNumber,
          professionalSummary: physiotherapist.professionalSummary ?? '',
          photoUrl: physiotherapist.photoUrl ?? '',
          yearsOfExperience: physiotherapist.yearsOfExperience,
        },
        { emitEvent: false },
      );
      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryPhoneOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
    if (!visible) {
      this.closed.emit();
    }
  }

  protected onSave(): void {
    if (this.pending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit(
      new UpdatePhysiotherapistCommand({
        fullName: value.fullName.trim(),
        specialty: value.specialty,
        email: value.email.trim(),
        countryCode: value.countryCode.trim(),
        phoneNumber: value.phoneNumber.trim(),
        licenseNumber: value.licenseNumber.trim(),
        professionalSummary: value.professionalSummary.trim(),
        photoUrl: value.photoUrl.trim(),
        yearsOfExperience: value.yearsOfExperience ?? 0,
      }),
    );
  }
}
