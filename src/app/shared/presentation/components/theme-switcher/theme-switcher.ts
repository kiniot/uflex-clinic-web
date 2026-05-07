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
    if (this.currentTheme === 'dark') {
      html.classList.add('app-dark');
    } else {
      html.classList.remove('app-dark');
    }
  }
}
