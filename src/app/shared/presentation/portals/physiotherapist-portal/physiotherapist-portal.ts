import { Component, computed, inject } from '@angular/core';
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
import { DemoModeBadge } from '../../components/demo-mode-badge/demo-mode-badge';

const SUPPORT_URL = 'https://uflex-landing-page.vercel.app/#contact';

/**
 * Top-level shell for the Physiotherapist portal. Wires the shared
 * AdminShell with the clinician sidebar (Dashboard, Therapy, Planning,
 * Device, Patients), the role pill in the topbar, and the avatar
 * profile block, then renders routed child views via <router-outlet/>.
 */
@Component({
  selector: 'app-physiotherapist-portal',
  imports: [RouterOutlet, AdminShell, AvatarModule, LanguageSwitcher, ThemeSwitcher, DemoModeBadge],
  templateUrl: './physiotherapist-portal.html',
  styleUrl: './physiotherapist-portal.scss',
})
export class PhysiotherapistPortal {
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected iamStore = inject(IamStore);

  protected currentEmail = this.iamStore.currentEmail;

  /** Same translated text as the topbar role pill — this portal only ever shows one role. */
  protected currentRoleLabel = computed(() => this.rolePillLabel());

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
      href: SUPPORT_URL,
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
  protected menuToggleLabel = computed(() => this.translations()['topbar.menu'] ?? 'Menu');
}
