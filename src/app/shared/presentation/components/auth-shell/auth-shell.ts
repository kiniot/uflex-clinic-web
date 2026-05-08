import {Component} from '@angular/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {ThemeSwitcher} from '../theme-switcher/theme-switcher';

/**
 * Shell for authentication views: vertically centers projected content with a
 * toolbar (theme on the left, language on the right) above it. The toolbar
 * shares the inner card's max-width so both align edge-to-edge.
 */
@Component({
  selector: 'app-auth-shell',
  imports: [ThemeSwitcher, LanguageSwitcher],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss'
})
export class AuthShell {}
