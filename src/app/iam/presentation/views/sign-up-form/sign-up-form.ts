import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, NgClass } from '@angular/common';
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
import { SubscriptionStore } from '../../../../subscription/application/subscription.store';
import {
  PublicSubscriptionTierSlug,
  SubscriptionBillingPeriod,
  SubscriptionCurrency,
} from '../../../../subscription/domain/model/subscription-catalog.types';
import { SubscriptionTier } from '../../../../subscription/domain/model/subscription-tier.entity';

type SignUpStep = 'plan' | 'account' | 'clinic';

@Component({
  selector: 'app-sign-up-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
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
export class SignUpForm extends BaseForm implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly iamStore = inject(IamStore);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly subscriptionStore = inject(SubscriptionStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  readonly enterpriseContactUrl = 'https://uflex-landing-page.vercel.app/#contact';
  readonly isSubmitting = signal(false);
  readonly currentStep = signal<SignUpStep>('plan');
  readonly kitsEditorTierSlug = signal<PublicSubscriptionTierSlug | null>(null);

  readonly publicTiers = this.subscriptionStore.publicTiers;
  readonly isLoadingCatalog = this.subscriptionStore.isLoadingCatalog;
  readonly selectedTier = this.subscriptionStore.selectedTier;
  readonly selectedTierSlug = this.subscriptionStore.selectedTierSlug;
  readonly selectedBillingPeriod = this.subscriptionStore.selectedBillingPeriod;
  readonly selectedCurrency = this.subscriptionStore.selectedCurrency;
  readonly selectedBasePrice = this.subscriptionStore.selectedBasePrice;
  readonly selectedKitUnitPrice = this.subscriptionStore.selectedKitUnitPrice;
  readonly selectedKitCharge = this.subscriptionStore.selectedKitCharge;
  readonly selectedGrandTotal = this.subscriptionStore.selectedGrandTotal;
  readonly normalizedRequestedTotalKits = this.subscriptionStore.normalizedRequestedTotalKits;
  readonly additionalKitCount = this.subscriptionStore.additionalKitCount;
  readonly canContinueWithSelfServeSelection = this.subscriptionStore.canContinueWithSelfServeSelection;

  accountForm = new FormGroup(
    {
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

  ngOnInit() {
    void this.initializeOnboarding();
  }

  protected async initializeOnboarding() {
    this.iamStore.resetSession();
    await this.subscriptionStore.loadCatalog();

    this.subscriptionStore.hydrateSelectionFromQuery({
      tier: this.route.snapshot.queryParamMap.get('tier'),
      billing: this.route.snapshot.queryParamMap.get('billing'),
      currency: this.route.snapshot.queryParamMap.get('currency'),
      kits: this.route.snapshot.queryParamMap.get('kits'),
    });
  }

  protected onTierSelected(slug: PublicSubscriptionTierSlug) {
    if (this.selectedTierSlug() !== slug) {
      this.kitsEditorTierSlug.set(null);
    }
    this.subscriptionStore.selectTier(slug);
    this.syncQueryParams();
  }

  protected onBillingPeriodSelected(period: SubscriptionBillingPeriod) {
    this.subscriptionStore.selectBillingPeriod(period);
    this.syncQueryParams();
  }

  protected onCurrencySelected(currency: SubscriptionCurrency) {
    this.subscriptionStore.selectCurrency(currency);
    this.syncQueryParams();
  }

  protected onRequestedKitsChanged(rawValue: string) {
    this.subscriptionStore.updateRequestedTotalKits(Number(rawValue));
    this.syncQueryParams();
  }

  protected continueToAccountStep() {
    if (!this.canContinueWithSelfServeSelection()) return;
    this.currentStep.set('account');
  }

  protected onPlanCta(tier: SubscriptionTier) {
    this.subscriptionStore.selectTier(tier.slug);
    this.syncQueryParams();

    if (tier.isContactOnly) {
      this.openEnterpriseContact();
      return;
    }

    if (this.isKitsEditorVisible(tier)) {
      this.continueToAccountStep();
      return;
    }

    this.kitsEditorTierSlug.set(tier.slug);
  }

  protected openEnterpriseContact() {
    window.location.assign(this.enterpriseContactUrl);
  }

  protected editPlanSelection() {
    this.currentStep.set('plan');
  }

  protected goBackFromAccountStep() {
    this.currentStep.set('plan');
  }

  protected goBackToAccountStep() {
    this.currentStep.set('account');
  }

  protected async performSignUp() {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.invalid || this.isSubmitting() || !this.canContinueWithSelfServeSelection()) {
      return;
    }

    this.isSubmitting.set(true);

    const signUpCommand = new SignUpCommand({
      email: this.accountForm.value.email!,
      password: this.accountForm.value.password!,
    });

    try {
      this.iamStore.resetSession();
      await this.iamStore.signUp(signUpCommand, this.router, null);
      await this.iamStore.signIn(this.currentCredentialsCommand(), this.router, null);
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

  protected async performCreateClinic() {
    this.clinicForm.markAllAsTouched();
    if (this.clinicForm.invalid || this.isSubmitting() || !this.canContinueWithSelfServeSelection()) {
      return;
    }

    this.isSubmitting.set(true);
    let clinicCreated = false;

    try {
      await this.organizationStore.createClinic(
        new CreateClinicCommand({
          legalName: this.clinicForm.value.legalName!,
          commercialName: this.clinicForm.value.commercialName!,
          ruc: this.clinicForm.value.ruc!,
          email: this.clinicForm.value.email!,
          countryCode: this.clinicForm.value.countryCode!,
          phoneNumber: this.clinicForm.value.phoneNumber!,
        }),
      );
      clinicCreated = true;
      await this.iamStore.signIn(this.currentCredentialsCommand(), this.router, null);
      const checkoutUrl = await this.subscriptionStore.beginCheckoutFromCurrentSelection();
      window.location.assign(checkoutUrl);
    } catch {
      if (clinicCreated) {
        this.messageService.add({
          severity: 'warn',
          summary: this.translate.instant('signUp.notifications.checkoutSummary'),
          detail: this.translate.instant('signUp.notifications.checkoutDetail'),
          life: 5000,
        });
        await this.router.navigate(['/subscription'], { queryParams: { payment: 'cancel' } });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('signUp.notifications.clinicErrorSummary'),
          detail: this.translate.instant('signUp.notifications.clinicGenericError'),
          life: 4500,
        });
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected isTierHighlighted(tier: SubscriptionTier): boolean {
    return tier.name === 'PROFESSIONAL';
  }

  protected billingLabel(period: SubscriptionBillingPeriod): string {
    return this.translate.instant(`signUp.planStep.billing.options.${period.toLowerCase()}`);
  }

  protected currencyLabel(currency: SubscriptionCurrency): string {
    return this.translate.instant(`signUp.planStep.currency.options.${currency.toLowerCase()}`);
  }

  protected formatMoney(amount: number | null, currency: SubscriptionCurrency): string {
    if (amount == null) return '--';
    if (this.translate.currentLang === 'es') {
      if (currency === 'PEN') return `S/${Math.round(amount)}`;
      return `$${Math.round(amount)}`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected tierDescriptionKey(tier: SubscriptionTier): string {
    return `signUp.planStep.tiers.${tier.slug}.description`;
  }

  protected tierFeatureKeys(tier: SubscriptionTier): string[] {
    switch (tier.slug) {
      case 'pilot':
        return ['featureAnalytics', 'featureRom', 'featureSupport'];
      case 'professional':
        return ['featureAnalytics', 'featureAlerts', 'featureReports', 'featureSupport'];
      case 'enterprise':
        return ['featureUnlimited', 'featureHce', 'featureWhiteLabel', 'featureSupport24x7'];
      default:
        return [];
    }
  }

  protected tierBadgeKey(tier: SubscriptionTier): string | null {
    if (tier.slug === 'professional') return 'signUp.planStep.tiers.professional.badge';
    if (tier.slug === 'pilot') return 'signUp.planStep.tiers.pilot.badge';
    if (tier.slug === 'enterprise') return 'signUp.planStep.tiers.enterprise.badge';
    return null;
  }

  protected trackTier(index: number, tier: SubscriptionTier): string {
    return `${index}-${tier.id}`;
  }

  protected maxKitsLabel(tier: SubscriptionTier): string | number {
    return tier.maximumRequestedTotalKits ?? this.translate.instant('signUp.planStep.unlimited');
  }

  protected isKitsEditorVisible(tier: SubscriptionTier): boolean {
    return this.selectedTierSlug() === tier.slug && this.kitsEditorTierSlug() === tier.slug;
  }

  protected decreaseKits(tier: SubscriptionTier) {
    const currentValue = this.normalizedRequestedTotalKits() ?? tier.kits.baseKits;
    this.subscriptionStore.updateRequestedTotalKits(currentValue - 1);
    this.syncQueryParams();
  }

  protected increaseKits(tier: SubscriptionTier) {
    const currentValue = this.normalizedRequestedTotalKits() ?? tier.kits.baseKits;
    this.subscriptionStore.updateRequestedTotalKits(currentValue + 1);
    this.syncQueryParams();
  }

  protected canDecreaseKits(tier: SubscriptionTier): boolean {
    const currentValue = this.normalizedRequestedTotalKits() ?? tier.kits.baseKits;
    return currentValue > tier.kits.baseKits;
  }

  protected canIncreaseKits(tier: SubscriptionTier): boolean {
    const currentValue = this.normalizedRequestedTotalKits() ?? tier.kits.baseKits;
    const maximum = tier.maximumRequestedTotalKits;
    return maximum == null || currentValue < maximum;
  }

  private currentCredentialsCommand(): SignInCommand {
    return new SignInCommand({
      email: this.accountForm.value.email!,
      password: this.accountForm.value.password!,
    });
  }

  private syncQueryParams() {
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: this.subscriptionStore.buildQueryParams(),
    });
    this.location.replaceState(this.router.serializeUrl(urlTree));
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
}
