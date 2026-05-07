import {Component, computed, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {FooterContent} from '../footer-content/footer-content';
import {ThemeSwitcher} from '../theme-switcher/theme-switcher';
import {
  AuthenticationSection
} from '../../../../iam/presentation/components/authentication-section/authentication-section';

/**
 * Main layout Component that provides the application's navigation structure and common UI elements in the presentation layer of the shared bounded context.
 */
@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcher,
    FooterContent,
    AuthenticationSection,
    ThemeSwitcher
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private router = inject(Router);

  /**
   * Array of navigation options for the application's menu.
   */
  options = [
    {link: '/home', label: 'option.home'},
    {link: '/about', label: 'option.about'},
  ]

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    {initialValue: this.router.url}
  );

  /**
   * Whether the active route belongs to the IAM bounded context (sign-in / sign-up).
   * Auth views render full-screen without the global header/footer.
   */
  isAuthRoute = computed(() => this.currentUrl().startsWith('/iam'));
}
