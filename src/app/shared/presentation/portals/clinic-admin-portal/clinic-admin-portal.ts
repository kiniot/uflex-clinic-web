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
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { ClinicAdminProfilePromptDialog } from '../../../../organization/presentation/components/clinic-admin-profile-prompt-dialog/clinic-admin-profile-prompt-dialog';

const SUPPORT_URL = 'https://uflex-landing-page.vercel.app/#contact';

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

  protected profilePromptVisible = signal<boolean>(false);

  protected currentEmail = this.iamStore.currentEmail;
  protected currentClinicAdminProfileStatus =
    this.organizationStore.currentClinicAdminProfileStatus;
  /** Same translated text as the topbar role pill — this portal only ever shows one role. */
  protected currentRoleLabel = computed(() => this.rolePillLabel());

  private readonly translations = toSignal(
    this.translate.stream([
      'clinicAdmin.brand.name',
      'clinicAdmin.brand.subtitle',
      'clinicAdmin.nav.exercises',
      'clinicAdmin.nav.device',
      'clinicAdmin.nav.organization',
      'clinicAdmin.nav.subscription',
      'clinicAdmin.nav.profile',
      'organization.profile.badge.pending',
      'clinicAdmin.nav.support',
      'clinicAdmin.nav.logout',
      'clinicAdmin.topbar.rolePill',
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
      href: SUPPORT_URL,
    },
    {
      label: this.translations()['clinicAdmin.nav.logout'] ?? '',
      icon: 'pi-sign-out',
      action: () => this.iamStore.signOut(this.router),
    },
  ]);

  protected rolePillLabel = computed(
    () => this.translations()['clinicAdmin.topbar.rolePill'] ?? '',
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
