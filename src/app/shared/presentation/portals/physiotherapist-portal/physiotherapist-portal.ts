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
import { DemoModeBadge } from '../../components/demo-mode-badge/demo-mode-badge';

const ROLE_LABELS: Record<string, string> = {
  ROLE_CLINIC_ADMIN: 'Clinic Admin',
  ROLE_PHYSIOTHERAPIST: 'Physiotherapist',
  ROLE_PATIENT: 'Patient',
  ROLE_USER: 'User',
};

/**
 * Top-level shell for the Physiotherapist portal. Wires the shared
 * AdminShell with the clinician sidebar (Dashboard, Therapy, Planning,
 * Device, Patients), the role pill in the topbar, and the avatar
 * profile block, then renders routed child views via <router-outlet/>.
 */
@Component({
  selector: 'app-physiotherapist-portal',
  imports: [
    RouterOutlet,
    AdminShell,
    AvatarModule,
    LanguageSwitcher,
    ThemeSwitcher,
    ChangePasswordDialog,
    DemoModeBadge,
  ],
  templateUrl: './physiotherapist-portal.html',
  styleUrl: './physiotherapist-portal.scss',
})
export class PhysiotherapistPortal {
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected iamStore = inject(IamStore);

  protected changePasswordVisible = signal<boolean>(false);

  protected currentEmail = this.iamStore.currentEmail;

  protected currentRoleLabel = computed(() => {
    const role = this.iamStore.currentEffectiveRole();
    if (!role) return '';
    return ROLE_LABELS[role] ?? role;
  });

  protected avatarInitials = computed(() => {
    const email = this.iamStore.currentEmail();
    if (!email) return '';
    const local = email.split('@')[0] ?? '';
    return local.slice(0, 2).toUpperCase();
  });

  private readonly translations = toSignal(
    this.translate.stream([
      'physiotherapist.brand.name',
      'physiotherapist.brand.subtitle',
      'physiotherapist.nav.dashboard',
      'physiotherapist.nav.therapy',
      'physiotherapist.nav.planning',
      'physiotherapist.nav.device',
      'physiotherapist.nav.organization',
      'physiotherapist.nav.support',
      'physiotherapist.nav.logout',
      'physiotherapist.topbar.rolePill',
      'topbar.changePassword',
      'topbar.menu',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected brand = computed<AdminBrand>(() => ({
    name: this.translations()['physiotherapist.brand.name'] ?? '',
    subtitle: this.translations()['physiotherapist.brand.subtitle'] ?? '',
  }));

  protected navItems = computed<AdminNavItem[]>(() => [
    {
      label: this.translations()['physiotherapist.nav.dashboard'] ?? '',
      icon: 'pi-th-large',
      route: '/physiotherapist/dashboard',
    },
    {
      label: this.translations()['physiotherapist.nav.organization'] ?? '',
      icon: 'pi-users',
      route: '/physiotherapist/patients',
    },
    {
      label: this.translations()['physiotherapist.nav.planning'] ?? '',
      icon: 'pi-calendar',
      route: '/physiotherapist/planning',
    },
    {
      label: this.translations()['physiotherapist.nav.device'] ?? '',
      icon: 'pi-mobile',
      route: '/physiotherapist/device',
    },
    {
      label: this.translations()['physiotherapist.nav.therapy'] ?? '',
      icon: 'pi-stopwatch',
      route: '/physiotherapist/therapy',
    },
  ]);

  protected bottomItems = computed<AdminBottomItem[]>(() => [
    {
      label: this.translations()['physiotherapist.nav.support'] ?? '',
      icon: 'pi-question-circle',
      action: () => console.log('Support clicked'),
    },
    {
      label: this.translations()['physiotherapist.nav.logout'] ?? '',
      icon: 'pi-sign-out',
      action: () => this.iamStore.signOut(this.router),
    },
  ]);

  protected rolePillLabel = computed(
    () => this.translations()['physiotherapist.topbar.rolePill'] ?? '',
  );
  protected changePasswordTooltip = computed(
    () => this.translations()['topbar.changePassword'] ?? 'Change password',
  );
  protected menuToggleLabel = computed(() => this.translations()['topbar.menu'] ?? 'Menu');

  protected openChangePassword() {
    this.changePasswordVisible.set(true);
  }
}
