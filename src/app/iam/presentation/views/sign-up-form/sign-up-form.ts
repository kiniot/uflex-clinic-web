import {Component, inject} from '@angular/core';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {SignUpCommand} from '../../../domain/model/sign-up.command';

/**
 * Component for the sign-up form view in the presentation layer of the IAM bounded context.
 * Allows users to register with a username and password.
 */
@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss'
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  /**
   * Form-group for the sign-up form.
   */
  form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  /**
   * Performs the sign-up operation if the form is valid.
   */
  performSignUp() {
    if (this.form.invalid) return;
    const signUpCommand = new SignUpCommand({
      username: this.form.value.username!,
      password: this.form.value.password!
    });
    this.store.signUp(signUpCommand, this.router);
  }
}

