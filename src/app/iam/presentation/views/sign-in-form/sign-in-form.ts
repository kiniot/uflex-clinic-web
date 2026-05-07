import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {IamStore} from '../../../application/iam.store';
import {SignInCommand} from '../../../domain/model/sign-in.command';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';

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
    CheckboxModule
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.scss'
})
export class SignInForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  /**
   * Form-group for the sign-in form.
   * `rememberMe` is a presentation-only control; it is not forwarded to SignInCommand.
   */
  form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    rememberMe: new FormControl(false, {nonNullable: true})
  });

  /**
   * Performs the sign-in operation if the form is valid.
   */
  performSignIn() {
    if (this.form.invalid) return;
    const signInCommand = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!
    });
    this.store.signIn(signInCommand, this.router);
  }
}
