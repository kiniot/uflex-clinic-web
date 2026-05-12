import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';

/**
 * Component for the sign-in form view in the presentation layer of the IAM bounded context.
 * Allows users to enter credentials and sign in.
 */
@Component({
  selector: 'app-sign-in-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    AuthShell,
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.scss',
})
export class SignInForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  readonly isSubmitting = signal(false);

  /**
   * Form-group for the sign-in form.
   * `rememberMe` is a presentation-only control; it is not forwarded to SignInCommand.
   */
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  /**
   * Performs the sign-in operation if the form is valid.
   */
  async performSignIn() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const signInCommand = new SignInCommand({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
    try {
      await this.store.signIn(signInCommand, this.router);
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('signIn.notifications.errorSummary'),
        detail: this.signInErrorMessage(err),
        life: 4500,
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private signInErrorMessage(err: unknown): string {
    const status =
      typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status?: unknown }).status)
        : 0;
    const key =
      status === 401 || status === 403
        ? 'signIn.notifications.invalidCredentials'
        : 'signIn.notifications.genericError';
    return this.translate.instant(key);
  }
}
