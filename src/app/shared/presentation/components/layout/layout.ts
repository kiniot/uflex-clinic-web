import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {FooterContent} from '../footer-content/footer-content';
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
    AuthenticationSection
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  /**
   * Array of navigation options for the application's menu.
   */
  options = [
    {link: '/home', label: 'option.home'},
    {link: '/about', label: 'option.about'},
  ]
}
