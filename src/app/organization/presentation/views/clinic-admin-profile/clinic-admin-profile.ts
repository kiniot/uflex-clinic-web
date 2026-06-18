import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';
import { StatCard } from '../../../../shared/presentation/components/stat-card/stat-card';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';
import { IamStore } from '../../../../iam/application/iam.store';
import { OrganizationStore } from '../../../application/organization.store';
import {
  ClinicAdminGender,
  RegisterClinicAdminCommand,
} from '../../../domain/model/register-clinic-admin.command';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-clinic-admin-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    PageHeader,
    StatCard,
  ],
  templateUrl: './clinic-admin-profile.html',
  styleUrl: './clinic-admin-profile.scss',
})
export class ClinicAdminProfile extends BaseForm {
  private readonly organizationStore = inject(OrganizationStore);
  private readonly iamStore = inject(IamStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly clinic = this.organizationStore.currentClinic;
  protected readonly clinicAdmin = this.organizationStore.currentClinicAdmin;
  protected readonly profileStatus = this.organizationStore.currentClinicAdminProfileStatus;
  protected readonly isLoadingProfile = this.organizationStore.isLoadingCurrentClinicAdmin;
  protected readonly isRegisteringProfile = this.organizationStore.isRegisteringClinicAdmin;
  protected readonly currentEmail = this.iamStore.currentEmail;
  protected readonly isProfileMissing = computed(() => this.profileStatus() === 'missing');
  protected readonly isProfileReady = computed(() => this.profileStatus() === 'ready');
  protected readonly isProfileError = computed(() => this.profileStatus() === 'error');
  protected readonly showForm = computed(
    () => this.profileStatus() === 'missing' || this.profileStatus() === 'ready',
  );
  protected readonly genderOptions = computed<SelectOption<ClinicAdminGender>[]>(() => [
    {
      label: this.translate.instant('organization.profile.form.genderOptions.MALE'),
      value: 'MALE',
    },
    {
      label: this.translate.instant('organization.profile.form.genderOptions.FEMALE'),
      value: 'FEMALE',
    },
    {
      label: this.translate.instant('organization.profile.form.genderOptions.OTHER'),
      value: 'OTHER',
    },
  ]);
  protected readonly countryPhoneOptions = computed<CountryPhoneOption[]>(() =>
    buildCountryPhoneOptions(this.translate),
  );
  protected readonly completionItems = computed(() => [
    this.translate.instant('organization.profile.completion.identity'),
    this.translate.instant('organization.profile.completion.contact'),
    this.translate.instant('organization.profile.completion.clinic'),
  ]);

  protected readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dni: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{8}$/)],
    }),
    birthDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl<ClinicAdminGender>('FEMALE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    countryCode: new FormControl('+51', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    super();

    effect(() => {
      void this.organizationStore.loadCurrentClinicOnce();
      void this.organizationStore.loadCurrentClinicAdminOnce();
    });

    effect(() => {
      const profile = this.clinicAdmin();
      const status = this.profileStatus();

      if (status === 'ready' && profile) {
        this.form.patchValue(
          {
            firstName: profile.firstName,
            lastName: profile.lastName,
            dni: profile.dni,
            birthDate: profile.birthDate,
            gender: (profile.gender as ClinicAdminGender) ?? 'OTHER',
            countryCode: profile.countryCode,
            phoneNumber: profile.phoneNumber,
          },
          { emitEvent: false },
        );
        this.form.disable({ emitEvent: false });
        return;
      }

      if (status === 'missing') {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryPhoneOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isRegisteringProfile() || this.isProfileReady()) return;

    const value = this.form.getRawValue();

    try {
      await this.organizationStore.registerClinicAdminProfile(
        new RegisterClinicAdminCommand({
          firstName: value.firstName.trim(),
          lastName: value.lastName.trim(),
          dni: value.dni.trim(),
          birthDate: value.birthDate,
          gender: value.gender,
          countryCode: value.countryCode.trim(),
          phoneNumber: value.phoneNumber.trim(),
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('organization.profile.notifications.createSuccessSummary'),
        detail: this.translate.instant('organization.profile.notifications.createSuccessDetail'),
        life: 4000,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.profile.notifications.createErrorSummary'),
        detail: this.translate.instant('organization.profile.notifications.createErrorDetail'),
        life: 4500,
      });
    }
  }

  protected async onRetry() {
    try {
      await this.organizationStore.loadCurrentClinicAdminOnce({ force: true });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('organization.profile.notifications.loadErrorSummary'),
        detail: this.translate.instant('organization.profile.notifications.loadErrorDetail'),
        life: 4500,
      });
    }
  }

  protected async onBackToOrganization() {
    await this.router.navigate(['/clinic-admin/organization']);
  }
}
