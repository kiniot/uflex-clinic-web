import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import {
  AdminBottomItem,
  AdminBrand,
  AdminNavItem,
  AdminShell
} from '../../components/admin-shell/admin-shell';
import { IamStore } from '../../../../iam/application/iam.store';
import { ChangePasswordDialog } from '../../../../iam/presentation/components/change-password-dialog/change-password-dialog';

const ROLE_LABELS: Record<string, string> = {
  ROLE_CLINIC_ADMIN: 'Clinic Admin',
  ROLE_PHYSIOTHERAPIST: 'Physiotherapist',
  ROLE_PATIENT: 'Patient',
  ROLE_USER: 'User'
};

/**
 * Top-level shell for the Physiotherapist portal. Wires the shared
 * AdminShell with the clinician sidebar (Dashboard, Therapy, Planning,
 * Device, Organization), the role pill in the topbar, and the avatar
 * profile block, then renders routed child views via <router-outlet/>.
 */
@Component({
  selector: 'app-physiotherapist-portal',
  imports: [RouterOutlet, AdminShell, AvatarModule, ButtonModule, ChangePasswordDialog],
  templateUrl: './physiotherapist-portal.html',
  styleUrl: './physiotherapist-portal.scss'
})
export class PhysiotherapistPortal {
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
      'physiotherapist.topbar.searchPlaceholder',
      'physiotherapist.topbar.rolePill',
      'topbar.changePassword'
    ]),
    { initialValue: {} as Record<string, string> }
  );

  protected brand = computed<AdminBrand>(() => ({
    monogram: 'uF',
    name: this.translations()['physiotherapist.brand.name'] ?? '',
    subtitle: this.translations()['physiotherapist.brand.subtitle'] ?? ''
  }));

  protected navItems = computed<AdminNavItem[]>(() => [
    { label: this.translations()['physiotherapist.nav.dashboard'] ?? '', icon: 'pi-th-large', route: '/physiotherapist/dashboard' },
    { label: this.translations()['physiotherapist.nav.therapy'] ?? '', icon: 'pi-stopwatch', route: '/physiotherapist/therapy' },
    { label: this.translations()['physiotherapist.nav.planning'] ?? '', icon: 'pi-calendar', route: '/physiotherapist/planning' },
    { label: this.translations()['physiotherapist.nav.device'] ?? '', icon: 'pi-mobile', route: '/physiotherapist/device' },
    { label: this.translations()['physiotherapist.nav.organization'] ?? '', icon: 'pi-building', route: '/physiotherapist/organization' }
  ]);

  protected bottomItems = computed<AdminBottomItem[]>(() => [
    { label: this.translations()['physiotherapist.nav.support'] ?? '', icon: 'pi-question-circle', action: () => console.log('Support clicked') },
    { label: this.translations()['physiotherapist.nav.logout'] ?? '', icon: 'pi-sign-out', action: () => this.iamStore.signOut(this.router) }
  ]);

  protected searchPlaceholder = computed(() => this.translations()['physiotherapist.topbar.searchPlaceholder'] ?? '');
  protected rolePillLabel = computed(() => this.translations()['physiotherapist.topbar.rolePill'] ?? '');
  protected changePasswordTooltip = computed(() => this.translations()['topbar.changePassword'] ?? 'Change password');

  protected openChangePassword() {
    this.changePasswordVisible.set(true);
  }
}
