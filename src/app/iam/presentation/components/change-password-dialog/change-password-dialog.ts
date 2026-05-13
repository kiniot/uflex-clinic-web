import { Component, inject, input, model, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { IamStore } from '../../../application/iam.store';
import { ChangePasswordCommand } from '../../../domain/model/change-password.command';

/**
 * Modal dialog for changing the authenticated user's password.
 * Uses the existing `PUT /users/me/password` endpoint via {@link IamStore}.
 */
@Component({
  selector: 'app-change-password-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, DialogModule, ButtonModule, PasswordModule, MessageModule],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss'
})
export class ChangePasswordDialog {
  private store = inject(IamStore);

  visible = model.required<boolean>();
  readonly closed = output<void>();

  protected submitting = false;
  protected feedback: { severity: 'success' | 'error'; message: string } | null = null;

  protected form = new FormGroup(
    {
      currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    },
    { validators: this.passwordsMatchValidator }
  );

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const next = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (next && confirm && next !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.feedback = null;

    const command = new ChangePasswordCommand({
      currentPassword: this.form.value.currentPassword!,
      newPassword: this.form.value.newPassword!
    });

    try {
      await this.store.changeMyPassword(command);
      this.feedback = { severity: 'success', message: 'changePassword.success' };
      this.form.reset();
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      this.feedback = {
        severity: 'error',
        message: status === 400 ? 'changePassword.error.invalidCurrent' : 'changePassword.error.generic'
      };
    } finally {
      this.submitting = false;
    }
  }

  protected onHide() {
    this.form.reset();
    this.feedback = null;
    this.submitting = false;
    this.closed.emit();
  }
}
