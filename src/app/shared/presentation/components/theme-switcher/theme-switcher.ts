import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';

type Theme = 'light' | 'dark';

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
export class ThemeSwitcher implements OnInit {
  private static readonly transitionDurationMs = 300;
  private static readonly transitionCleanupBufferMs = 70;
  private transitionTimer: number | null = null;
  protected currentTheme: Theme = 'light';

  protected themeOptions: ThemeOption[] = [
    {value: 'light', icon: 'pi pi-sun', ariaLabel: 'Light mode'},
    {value: 'dark', icon: 'pi pi-moon', ariaLabel: 'Dark mode'}
  ];

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.currentTheme = savedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
  }

  setTheme(theme: Theme) {
    if (!theme || theme === this.currentTheme) return;
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  private applyTheme() {
    const html = document.documentElement;
    html.classList.add('theme-switching');

    if (this.currentTheme === 'dark') {
      html.classList.add('app-dark');
    } else {
      html.classList.remove('app-dark');
    }

    if (this.transitionTimer !== null) {
      window.clearTimeout(this.transitionTimer);
    }

    this.transitionTimer = window.setTimeout(() => {
      html.classList.remove('theme-switching');
      this.transitionTimer = null;
    }, ThemeSwitcher.transitionDurationMs + ThemeSwitcher.transitionCleanupBufferMs);
  }
}
