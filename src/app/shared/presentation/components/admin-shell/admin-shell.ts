import {Component, input, output} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SearchInput} from '../search-input/search-input';

/**
 * Single nav entry rendered inside the AdminShell sidebar.
 * `route` is consumed by routerLink, `icon` is a PrimeIcons class fragment
 * (e.g. "pi-th-large"), and `label` is the already-translated text.
 */
export interface AdminNavItem {
  label: string;
  icon: string;
  route: string;
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
 * Identity block at the top of the sidebar — logo monogram, brand name,
 * subtitle, and an optional badge (e.g. "ADMIN").
 */
export interface AdminBrand {
  monogram: string;
  name: string;
  subtitle: string;
  badge?: string;
}

/**
 * Admin portal shell: fixed sidebar with brand + nav, topbar with search and
 * action slot, and a content area projected via <ng-content/>. The shell is
 * role-agnostic — clinic-admin and physiotherapist portals configure it with
 * their own nav data.
 */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterLink, RouterLinkActive, SearchInput],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss'
})
export class AdminShell {
  brand = input.required<AdminBrand>();
  navItems = input.required<AdminNavItem[]>();
  bottomItems = input<AdminBottomItem[]>([]);
  searchPlaceholder = input<string>('');
  searchValue = input<string>('');

  readonly searchValueChange = output<string>();

  protected onSearch(next: string) {
    this.searchValueChange.emit(next);
  }

  protected runBottomItem(item: AdminBottomItem) {
    if (!item.route && item.action) item.action();
  }
}
