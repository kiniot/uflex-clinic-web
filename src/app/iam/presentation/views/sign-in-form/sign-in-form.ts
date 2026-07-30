import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { AppErrorNotifier } from '../../../../shared/application/app-error-notifier';
import { DEMO_QUERY_PARAM } from '../../../../shared/infrastructure/demo/demo.constants';

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
  private route = inject(ActivatedRoute);
  private store = inject(IamStore);
  private appErrorNotifier = inject(AppErrorNotifier);

  readonly isSubmitting = signal(false);

  constructor() {
    super();
    if (this.route.snapshot.queryParamMap.get(DEMO_QUERY_PARAM) != null) {
      this.startDemo();
    }
  }

  /**
   * Form-group for the sign-in form. `rememberMe` is not part of `SignInCommand` — it only
   * decides which storage `IamStore` keeps the token in, not anything sent to the backend.
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
      await this.store.signIn(
        signInCommand,
        this.router,
        undefined,
        this.form.controls.rememberMe.value,
      );
    } catch (err) {
      this.appErrorNotifier.showHttpError(err, {
        summaryKey: 'signIn.notifications.errorSummary',
        fallbackDetailKey: 'signIn.notifications.genericError',
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Starts a client-only guest session (no backend call) and lands on the
   * physiotherapist portal, so the portfolio deployment is explorable with the
   * real backend turned off.
   */
  startDemo() {
    this.store.activateDemoSession();
    this.router.navigate([this.store.currentPortalLandingRoute() ?? '/forbidden']).then();
  }
}
