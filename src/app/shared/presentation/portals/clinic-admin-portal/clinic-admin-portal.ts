import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AvatarModule } from 'primeng/avatar';
import {
  AdminBottomItem,
  AdminBrand,
  AdminNavItem,
  AdminShell,
} from '../../components/admin-shell/admin-shell';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';
import { ThemeSwitcher } from '../../components/theme-switcher/theme-switcher';
import { IamStore } from '../../../../iam/application/iam.store';
import { ChangePasswordDialog } from '../../../../iam/presentation/components/change-password-dialog/change-password-dialog';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { ClinicAdminProfilePromptDialog } from '../../../../organization/presentation/components/clinic-admin-profile-prompt-dialog/clinic-admin-profile-prompt-dialog';

const ROLE_LABELS: Record<string, string> = {
  ROLE_CLINIC_ADMIN: 'Clinic Admin',
  ROLE_PHYSIOTHERAPIST: 'Physiotherapist',
  ROLE_PATIENT: 'Patient',
  ROLE_USER: 'User',
};

/**
 * Top-level shell for the Clinic Admin portal. Wires the shared AdminShell
 * with Clinic-Admin-specific navigation, brand identity, and topbar actions
 * (clinic selector, notifications, settings, avatar) and renders the
 * routed child views via <router-outlet/>.
 */
@Component({
  selector: 'app-clinic-admin-portal',
  imports: [
    RouterOutlet,
    AdminShell,
    AvatarModule,
    LanguageSwitcher,
    ThemeSwitcher,
    ChangePasswordDialog,
    ClinicAdminProfilePromptDialog,
  ],
  templateUrl: './clinic-admin-portal.html',
  styleUrl: './clinic-admin-portal.scss',
})
export class ClinicAdminPortal {
  private static readonly profilePromptStorageKey = 'clinicAdminProfilePromptDismissed';

  private router = inject(Router);
  private translate = inject(TranslateService);
  protected iamStore = inject(IamStore);
  private readonly organizationStore = inject(OrganizationStore);

  protected changePasswordVisible = signal<boolean>(false);
  protected profilePromptVisible = signal<boolean>(false);

  protected currentEmail = this.iamStore.currentEmail;
  protected currentClinicAdminProfileStatus = this.organizationStore.currentClinicAdminProfileStatus;
  protected currentRoleLabel = computed(() => {
    const role = this.iamStore.currentEffectiveRole();
    if (!role) return '';
    return ROLE_LABELS[role] ?? role;
  });

  private readonly translations = toSignal(
    this.translate.stream([
      'clinicAdmin.brand.name',
      'clinicAdmin.brand.subtitle',
      'clinicAdmin.nav.therapy',
      'clinicAdmin.nav.exercises',
      'clinicAdmin.nav.device',
      'clinicAdmin.nav.organization',
      'clinicAdmin.nav.subscription',
      'clinicAdmin.nav.profile',
      'organization.profile.badge.pending',
      'clinicAdmin.nav.support',
      'clinicAdmin.nav.logout',
      'clinicAdmin.topbar.searchPlaceholder',
      'clinicAdmin.topbar.rolePill',
      'topbar.changePassword',
      'topbar.menu',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected brand = computed<AdminBrand>(() => ({
    name: this.translations()['clinicAdmin.brand.name'] ?? '',
    subtitle: this.translations()['clinicAdmin.brand.subtitle'] ?? '',
  }));

  protected navItems = computed<AdminNavItem[]>(() => [
    {
      label: this.translations()['clinicAdmin.nav.organization'] ?? '',
      icon: 'pi-building',
      route: '/clinic-admin/organization',
    },
    {
      label: this.translations()['clinicAdmin.nav.device'] ?? '',
      icon: 'pi-mobile',
      route: '/clinic-admin/device',
    },
    {
      label: this.translations()['clinicAdmin.nav.therapy'] ?? '',
      icon: 'pi-th-large',
      route: '/clinic-admin/therapy',
    },
    {
      label: this.translations()['clinicAdmin.nav.exercises'] ?? '',
      icon: 'pi-book',
      route: '/clinic-admin/exercises',
    },
    {
      label: this.translations()['clinicAdmin.nav.subscription'] ?? '',
      icon: 'pi-credit-card',
      route: '/clinic-admin/subscription',
    },
    {
      label: this.translations()['clinicAdmin.nav.profile'] ?? '',
      icon: 'pi-user',
      route: '/clinic-admin/profile',
      badgeLabel:
        this.currentClinicAdminProfileStatus() === 'missing'
          ? (this.translations()['organization.profile.badge.pending'] ?? '')
          : undefined,
      badgeTone: this.currentClinicAdminProfileStatus() === 'missing' ? 'warning' : 'neutral',
    },
  ]);

  protected bottomItems = computed<AdminBottomItem[]>(() => [
    {
      label: this.translations()['clinicAdmin.nav.support'] ?? '',
      icon: 'pi-question-circle',
      action: () => console.log('Support clicked'),
    },
    {
      label: this.translations()['clinicAdmin.nav.logout'] ?? '',
      icon: 'pi-sign-out',
      action: () => this.iamStore.signOut(this.router),
    },
  ]);

  protected searchPlaceholder = computed(
    () => this.translations()['clinicAdmin.topbar.searchPlaceholder'] ?? '',
  );
  protected rolePillLabel = computed(
    () => this.translations()['clinicAdmin.topbar.rolePill'] ?? '',
  );
  protected changePasswordTooltip = computed(
    () => this.translations()['topbar.changePassword'] ?? 'Change password',
  );
  protected menuToggleLabel = computed(() => this.translations()['topbar.menu'] ?? 'Menu');

  constructor() {
    effect(() => {
      void this.organizationStore.loadCurrentClinicAdminOnce();
    });

    effect(() => {
      const status = this.currentClinicAdminProfileStatus();
      if (status !== 'missing') {
        this.profilePromptVisible.set(false);
        return;
      }

      if (sessionStorage.getItem(ClinicAdminPortal.profilePromptStorageKey) === 'true') {
        return;
      }

      if (this.router.url.startsWith('/clinic-admin/profile')) {
        return;
      }

      this.profilePromptVisible.set(true);
    });
  }

  protected openChangePassword() {
    this.changePasswordVisible.set(true);
  }

  protected async openProfileSetup() {
    sessionStorage.setItem(ClinicAdminPortal.profilePromptStorageKey, 'true');
    this.profilePromptVisible.set(false);
    await this.router.navigate(['/clinic-admin/profile']);
  }

  protected postponeProfileSetup() {
    sessionStorage.setItem(ClinicAdminPortal.profilePromptStorageKey, 'true');
    this.profilePromptVisible.set(false);
  }
}
