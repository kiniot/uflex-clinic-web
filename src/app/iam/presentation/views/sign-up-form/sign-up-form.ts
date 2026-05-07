import {Component, inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {IamStore} from '../../../application/iam.store';
import {SignUpCommand} from '../../../domain/model/sign-up.command';

type Role = 'physiotherapist' | 'clinicAdmin';

interface RoleOption {
  label: string;
  value: Role;
}

/**
 * Component for the sign-up form view in the presentation layer of the IAM bounded context.
 * Mirrors the card layout of sign-in and renders the Create Account fields from the Figma design.
 *
 * The backend currently only accepts {username, password}; email is forwarded as username and
 * the extra controls (role, fullName, confirmPassword, invitationCode) are presentation-only.
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
    SelectButtonModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss'
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  protected roleOptions: RoleOption[] = [
    {label: 'signUp.roles.physiotherapist', value: 'physiotherapist'},
    {label: 'signUp.roles.clinicAdmin', value: 'clinicAdmin'}
  ];

  form = new FormGroup({
    role: new FormControl<Role>('physiotherapist', {nonNullable: true, validators: [Validators.required]}),
    fullName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(8)]}),
    confirmPassword: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    invitationCode: new FormControl('', {nonNullable: true})
  }, {validators: this.passwordsMatchValidator});

  /**
   * Form-level validator that flags `confirmPassword` when it does not match `password`.
   */
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    }
    return null;
  }

  performSignUp() {
    if (this.form.invalid) return;
    const signUpCommand = new SignUpCommand({
      username: this.form.value.email!,
      password: this.form.value.password!
    });
    this.store.signUp(signUpCommand, this.router);
  }
}
