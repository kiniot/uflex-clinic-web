import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MediaAsset } from '../../../../media/domain/model/media.model';
import { MediaUploader } from '../../../../media/presentation/media-uploader/media-uploader';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';
import { OrganizationStore } from '../../../application/organization.store';
import { RegisterPhysiotherapistCommand } from '../../../domain/model/register-physiotherapist.command';
import { PhysiotherapistSpecialty } from '../../../domain/model/physiotherapist-profile.entity';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-register-physiotherapist',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    MediaUploader,
    TooltipModule,
  ],
  templateUrl: './register-physiotherapist.html',
  styleUrl: './register-physiotherapist.scss',
})
export class RegisterPhysiotherapist extends BaseForm {
  private readonly organizationStore = inject(OrganizationStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly isRegisteringPhysiotherapist =
    this.organizationStore.isRegisteringPhysiotherapist;
  protected readonly specialtyOptions = computed<SelectOption<PhysiotherapistSpecialty>[]>(() => [
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
  protected readonly photoPreviewUrl = signal<string | null>(null);
  protected readonly photoAssetId = signal<string | null>(null);
  protected readonly isPhotoUploading = signal(false);

  protected readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    specialty: new FormControl<PhysiotherapistSpecialty>('GENERAL', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    countryCode: new FormControl('+51', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    licenseNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    professionalSummary: new FormControl('', { nonNullable: true }),
    yearsOfExperience: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  protected onCancel() {
    void this.router.navigate(['/clinic-admin/organization'], {
      queryParams: { tab: 'physiotherapists' },
    });
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isRegisteringPhysiotherapist() || this.isPhotoUploading()) return;
    void this.registerPhysiotherapist();
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryPhoneOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }

  protected onPhotoUploaded(asset: MediaAsset): void {
    this.photoAssetId.set(asset.id);
    this.photoPreviewUrl.set(asset.downloadUrl);
  }

  protected onPhotoUploadingChange(isUploading: boolean): void {
    this.isPhotoUploading.set(isUploading);
  }

  protected onRemovePhoto(): void {
    this.photoAssetId.set(null);
    this.photoPreviewUrl.set(null);
    this.isPhotoUploading.set(false);
  }

  private async registerPhysiotherapist(): Promise<void> {
    const value = this.form.getRawValue();
    try {
      const physiotherapist = await this.organizationStore.registerPhysiotherapistAsClinicAdmin(
        new RegisterPhysiotherapistCommand({
          fullName: value.fullName.trim(),
          specialty: value.specialty,
          email: value.email.trim(),
          countryCode: value.countryCode.trim(),
          phoneNumber: value.phoneNumber.trim(),
          licenseNumber: value.licenseNumber.trim(),
          professionalSummary: value.professionalSummary.trim(),
          photoAssetId: this.photoAssetId() ?? undefined,
          yearsOfExperience: value.yearsOfExperience ?? 0,
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('registerPhysiotherapist.notifications.successSummary'),
        detail: this.translate.instant('registerPhysiotherapist.notifications.successDetail', {
          name: physiotherapist.fullName,
        }),
        life: 4000,
      });

      await this.router.navigate([
        '/clinic-admin/organization/physiotherapists',
        physiotherapist.id,
      ]);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('registerPhysiotherapist.notifications.errorSummary'),
        detail: this.translate.instant('registerPhysiotherapist.notifications.errorDetail'),
        life: 4500,
      });
    }
  }
}
