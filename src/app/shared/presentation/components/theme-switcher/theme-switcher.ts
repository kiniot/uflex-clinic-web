import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Theme, ThemeStore } from '../../../application/theme.store';

interface ThemeOption {
  value: Theme;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule, SelectButtonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher {
  private readonly themeStore = inject(ThemeStore);

  /** Reads the signal so the toggle stays in step with whoever changed the theme. */
  protected readonly currentTheme = this.themeStore.theme;

  protected themeOptions: ThemeOption[] = [
    { value: 'light', icon: 'pi pi-sun', ariaLabel: 'Light mode' },
    { value: 'dark', icon: 'pi pi-moon', ariaLabel: 'Dark mode' },
  ];

  protected setTheme(theme: Theme) {
    if (!theme) return;
    this.themeStore.setTheme(theme);
  }
}
