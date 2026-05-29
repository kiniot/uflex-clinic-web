import { Component, computed, inject, signal } from '@angular/core';
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
  ],
  templateUrl: './clinic-admin-portal.html',
  styleUrl: './clinic-admin-portal.scss',
})
export class ClinicAdminPortal {
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected iamStore = inject(IamStore);

  protected changePasswordVisible = signal<boolean>(false);

  protected currentEmail = this.iamStore.currentEmail;
  protected currentRoleLabel = computed(() => {
    const roles = this.iamStore.currentRoles();
    if (!roles.length) return '';
    return ROLE_LABELS[roles[0]] ?? roles[0];
  });

  private readonly translations = toSignal(
    this.translate.stream([
      'clinicAdmin.brand.name',
      'clinicAdmin.brand.subtitle',
      'clinicAdmin.nav.therapy',
      'clinicAdmin.nav.device',
      'clinicAdmin.nav.organization',
      'clinicAdmin.nav.subscription',
      'clinicAdmin.nav.profile',
      'clinicAdmin.nav.support',
      'clinicAdmin.nav.logout',
      'clinicAdmin.topbar.searchPlaceholder',
      'clinicAdmin.topbar.rolePill',
      'topbar.changePassword',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected brand = computed<AdminBrand>(() => ({
    name: this.translations()['clinicAdmin.brand.name'] ?? '',
    subtitle: this.translations()['clinicAdmin.brand.subtitle'] ?? '',
  }));

  protected navItems = computed<AdminNavItem[]>(() => [
    {
      label: this.translations()['clinicAdmin.nav.therapy'] ?? '',
      icon: 'pi-th-large',
      route: '/clinic-admin/therapy',
    },
    {
      label: this.translations()['clinicAdmin.nav.device'] ?? '',
      icon: 'pi-mobile',
      route: '/clinic-admin/device',
    },
    {
      label: this.translations()['clinicAdmin.nav.organization'] ?? '',
      icon: 'pi-building',
      route: '/clinic-admin/organization',
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

  protected openChangePassword() {
    this.changePasswordVisible.set(true);
  }
}
