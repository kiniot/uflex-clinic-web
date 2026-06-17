import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { OrganizationStore } from '../../../application/organization.store';
import { RegisterPatientCommand } from '../../../domain/model/register-patient.command';
import { PatientGender } from '../../../domain/model/patient.types';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import {
  buildCountryPhoneOptions,
  CountryPhoneOption,
} from '../../../../shared/presentation/utils/country-phone-options';

interface SelectOption<T> {
  label: string;
  value: T;
}

type RoleContext = 'admin' | 'physiotherapist';

@Component({
  selector: 'app-register-patient',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './register-patient.html',
  styleUrl: './register-patient.scss',
})
export class RegisterPatient extends BaseForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly roleContext =
    (this.route.snapshot.data['roleContext'] as RoleContext | undefined) ?? 'physiotherapist';

  private readonly translations = toSignal(
    this.translate.stream([
      'registerPatientView.genderOptions.MALE',
      'registerPatientView.genderOptions.FEMALE',
      'organization.assignment.keepUnassigned',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected readonly isRegisteringPatient = this.organizationStore.isRegisteringPatient;
  protected readonly physiotherapists = this.organizationStore.physiotherapists;
  protected readonly isAdminContext = this.roleContext === 'admin';
  protected readonly genderOptions = computed<SelectOption<PatientGender>[]>(() => [
    {
      label: this.translations()['registerPatientView.genderOptions.MALE'] ?? 'Male',
      value: 'MALE',
    },
    {
      label: this.translations()['registerPatientView.genderOptions.FEMALE'] ?? 'Female',
      value: 'FEMALE',
    },
  ]);
  protected readonly physiotherapistOptions = computed<SelectOption<string | null>[]>(() => [
    {
      label: this.translations()['organization.assignment.keepUnassigned'] ?? 'Keep unassigned',
      value: null,
    },
    ...this.physiotherapists().map((physiotherapist) => ({
      label: physiotherapist.fullName,
      value: physiotherapist.id,
    })),
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
    assignedPhysiotherapistId: new FormControl<string | null>(null),
  });

  constructor() {
    super();
    if (this.isAdminContext) {
      void this.organizationStore.loadClinicPhysiotherapists();
    }
  }

  protected onCancel() {
    void this.router.navigate(
      this.isAdminContext ? ['/clinic-admin/organization'] : ['/physiotherapist/patients'],
      this.isAdminContext ? { queryParams: { tab: 'patients' } } : undefined,
    );
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isRegisteringPatient()) return;
    void this.registerPatient();
  }

  protected countryPhoneOption(phoneCode: string | null | undefined): CountryPhoneOption | null {
    return this.countryPhoneOptions().find((option) => option.phoneCode === phoneCode) ?? null;
  }

  private async registerPatient(): Promise<void> {
    const value = this.form.getRawValue();
    const command = new RegisterPatientCommand({
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      dni: value.dni.trim(),
      birthDate: value.birthDate,
      gender: value.gender,
      email: value.email.trim(),
      countryCode: value.countryCode.trim(),
      phoneNumber: value.phoneNumber.trim(),
      medicalCondition: value.medicalCondition.trim(),
      assignedPhysiotherapistId: value.assignedPhysiotherapistId,
    });

    try {
      const patient = await (this.isAdminContext
        ? this.organizationStore.registerPatientAsClinicAdmin(command)
        : this.organizationStore.registerPatient(command));

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('registerPatientView.notifications.successSummary'),
        detail: this.translate.instant('registerPatientView.notifications.successDetail', {
          name: patient.fullName,
        }),
        life: 4000,
      });

      await this.router.navigate(
        this.isAdminContext
          ? ['/clinic-admin/organization/patients', patient.id]
          : ['/physiotherapist/patients', patient.id],
      );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('registerPatientView.notifications.errorSummary'),
        detail: this.translate.instant('registerPatientView.notifications.errorDetail'),
        life: 4500,
      });
    }
  }
}
