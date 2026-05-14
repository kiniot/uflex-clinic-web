import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { CreateClinicCommand } from '../../../../organization/domain/model/create-clinic.command';

type SignUpStep = 'account' | 'clinic';

/**
 * Component for the sign-up form view in the presentation layer of the IAM bounded context.
 * Mirrors the card layout of sign-in and renders the Create Account fields from the Figma design.
 *
 * The backend currently only accepts email and password; fullName and confirmPassword are
 * presentation-only.
 */
@Component({
  selector: 'app-sign-up-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    AuthShell,
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private iamStore = inject(IamStore);
  private organizationStore = inject(OrganizationStore);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  readonly isSubmitting = signal(false);
  readonly currentStep = signal<SignUpStep>('account');

  accountForm = new FormGroup(
    {
      fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordsMatchValidator },
  );

  clinicForm = new FormGroup({
    legalName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    commercialName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ruc: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{11}$/)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    countryCode: new FormControl('+51', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+\d{1,4}$/)],
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6,15}$/)],
    }),
  });

  /**
   * Form-level validator that flags `confirmPassword` when it does not match `password`.
   */
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async performSignUp() {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const signUpCommand = new SignUpCommand({
      email: this.accountForm.value.email!,
      password: this.accountForm.value.password!,
    });
    const signInCommand = new SignInCommand({
      email: this.accountForm.value.email!,
      password: this.accountForm.value.password!,
    });
    try {
      await this.iamStore.signUp(signUpCommand, this.router, null);
      await this.iamStore.signIn(signInCommand, this.router, null);
      this.clinicForm.patchValue({ email: this.accountForm.value.email! });
      this.currentStep.set('clinic');
      this.messageService.add({
        severity: 'info',
        summary: this.translate.instant('signUp.notifications.accountCreatedSummary'),
        detail: this.translate.instant('signUp.notifications.accountCreatedDetail'),
        life: 4000,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('signUp.notifications.errorSummary'),
        detail: this.translate.instant('signUp.notifications.genericError'),
        life: 4500,
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async performCreateClinic() {
    this.clinicForm.markAllAsTouched();
    if (this.clinicForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const createClinicCommand = new CreateClinicCommand({
      legalName: this.clinicForm.value.legalName!,
      commercialName: this.clinicForm.value.commercialName!,
      ruc: this.clinicForm.value.ruc!,
      email: this.clinicForm.value.email!,
      countryCode: this.clinicForm.value.countryCode!,
      phoneNumber: this.clinicForm.value.phoneNumber!,
    });

    try {
      await this.organizationStore.createClinic(createClinicCommand);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('signUp.notifications.successSummary'),
        detail: this.translate.instant('signUp.notifications.successDetail'),
        life: 5000,
      });
      await this.router.navigate(['/clinic-admin/therapy']);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('signUp.notifications.clinicErrorSummary'),
        detail: this.translate.instant('signUp.notifications.clinicGenericError'),
        life: 4500,
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBackToAccountStep() {
    this.currentStep.set('account');
  }
}
