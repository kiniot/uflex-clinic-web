import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Single nav entry rendered inside the AdminShell sidebar.
 * `route` is consumed by routerLink, `icon` is a PrimeIcons class fragment
 * (e.g. "pi-th-large"), and `label` is the already-translated text.
 */
export interface AdminNavItem {
  label: string;
  icon: string;
  route: string;
  badgeLabel?: string;
  badgeTone?: 'neutral' | 'warning';
}

/**
 * Action shown in the sidebar bottom area (Support / Logout).
 * Either `route` (link) or `action` (callback) is provided; if both are set,
 * `route` wins.
 */
export interface AdminBottomItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

/**
 * Identity block at the top of the sidebar — brand mark, brand name,
 * and subtitle.
 */
export interface AdminBrand {
  name: string;
  subtitle: string;
}

/**
 * Admin portal shell: fixed sidebar with brand + nav, topbar with a left
 * projection slot (e.g. a status badge) and an action slot, and a content
 * area projected via <ng-content/>. The shell is role-agnostic —
 * clinic-admin and physiotherapist portals configure it with their own nav
 * data.
 */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
})
export class AdminShell {
  brand = input.required<AdminBrand>();
  navItems = input.required<AdminNavItem[]>();
  bottomItems = input<AdminBottomItem[]>([]);
  /** Accessible label for the mobile nav toggle; optional so existing callers stay valid. */
  menuToggleLabel = input<string>('Menu');

  /** Whether the off-canvas sidebar is open on small viewports. Ignored on desktop. */
  protected readonly mobileNavOpen = signal(false);

  protected toggleMobileNav() {
    this.mobileNavOpen.update((open) => !open);
  }

  protected closeMobileNav() {
    this.mobileNavOpen.set(false);
  }

  protected runBottomItem(item: AdminBottomItem) {
    if (!item.route && item.action) item.action();
  }
}
