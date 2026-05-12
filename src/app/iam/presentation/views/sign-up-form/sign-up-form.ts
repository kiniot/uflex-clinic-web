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
import { MessageService } from 'primeng/api';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';

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
    AuthShell,
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  readonly isSubmitting = signal(false);

  form = new FormGroup(
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
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const signUpCommand = new SignUpCommand({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
    try {
      await this.store.signUp(signUpCommand, this.router);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('signUp.notifications.successSummary'),
        detail: this.translate.instant('signUp.notifications.successDetail'),
        life: 5000,
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
}
