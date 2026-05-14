import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthShell } from '../../../../shared/presentation/components/auth-shell/auth-shell';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';

type SubscriptionPlanId = 'starter' | 'professional' | 'enterprise';

interface SubscriptionPlanViewModel {
  id: SubscriptionPlanId;
  badgeKey: string;
  nameKey: string;
  priceKey: string;
  descriptionKey: string;
  featuresKeys: string[];
  ctaKey: string;
  highlighted?: boolean;
}

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(IamStore);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  readonly isSubmitting = signal(false);
  readonly uiStage = signal<'selection' | 'selected'>('selection');
  readonly isTransitioning = signal(false);
  readonly selectedPlanId = signal<SubscriptionPlanId | null>(null);
  readonly plans: SubscriptionPlanViewModel[] = [
    {
      id: 'starter',
      badgeKey: 'signUp.plans.starter.badge',
      nameKey: 'signUp.plans.starter.name',
      priceKey: 'signUp.plans.starter.price',
      descriptionKey: 'signUp.plans.starter.description',
      featuresKeys: [
        'signUp.plans.starter.features.device',
        'signUp.plans.starter.features.dashboard',
        'signUp.plans.starter.features.support',
      ],
      ctaKey: 'signUp.plans.starter.cta',
    },
    {
      id: 'professional',
      badgeKey: 'signUp.plans.professional.badge',
      nameKey: 'signUp.plans.professional.name',
      priceKey: 'signUp.plans.professional.price',
      descriptionKey: 'signUp.plans.professional.description',
      featuresKeys: [
        'signUp.plans.professional.features.devices',
        'signUp.plans.professional.features.reports',
        'signUp.plans.professional.features.onboarding',
      ],
      ctaKey: 'signUp.plans.professional.cta',
      highlighted: true,
    },
    {
      id: 'enterprise',
      badgeKey: 'signUp.plans.enterprise.badge',
      nameKey: 'signUp.plans.enterprise.name',
      priceKey: 'signUp.plans.enterprise.price',
      descriptionKey: 'signUp.plans.enterprise.description',
      featuresKeys: [
        'signUp.plans.enterprise.features.devices',
        'signUp.plans.enterprise.features.integrations',
        'signUp.plans.enterprise.features.support',
      ],
      ctaKey: 'signUp.plans.enterprise.cta',
    },
  ];
  readonly selectedPlan = computed(
    () => this.plans.find((plan) => plan.id === this.selectedPlanId()) ?? null,
  );

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

  constructor() {
    super();

    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const routePlanId = params.get('planId');
      const normalizedPlanId = this.isSubscriptionPlanId(routePlanId) ? routePlanId : null;

      if (routePlanId && !normalizedPlanId) {
        void this.router.navigate(['/iam/sign-up']);
        return;
      }

      this.selectedPlanId.set(normalizedPlanId);
      this.uiStage.set(normalizedPlanId ? 'selected' : 'selection');
      this.isTransitioning.set(false);
    });
  }

  selectPlan(planId: SubscriptionPlanId) {
    if (this.isTransitioning()) return;
    if (this.selectedPlanId() === planId && this.uiStage() === 'selected') return;

    this.isTransitioning.set(true);
    window.setTimeout(() => {
      void this.router.navigate(['/iam/sign-up', planId]);
    }, 160);
  }

  clearSelectedPlan() {
    if (this.isTransitioning()) return;

    this.isTransitioning.set(true);
    window.setTimeout(() => {
      void this.router.navigate(['/iam/sign-up']);
    }, 160);
  }

  private isSubscriptionPlanId(planId: string | null): planId is SubscriptionPlanId {
    return planId === 'starter' || planId === 'professional' || planId === 'enterprise';
  }

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
