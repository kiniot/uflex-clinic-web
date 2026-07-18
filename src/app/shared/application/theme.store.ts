import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const DARK_MODE_CLASS = 'app-dark';

/**
 * Owns the active theme: the `.app-dark` class on `<html>` (which PrimeNG's preset keys off),
 * its localStorage persistence, and a signal so components can react to it.
 *
 * <p>The signal is the reason this exists. The theme used to live in a ThemeSwitcher field, so
 * anything that has to recompute on a theme change — a chart resolving its colours from CSS custom
 * properties, say — had no way to know it happened.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly themeSignal = signal<Theme>(this.resolveInitialTheme());

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  setTheme(theme: Theme) {
    if (theme === this.themeSignal()) return;
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private resolveInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return document.documentElement.classList.contains(DARK_MODE_CLASS) ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    document.documentElement.classList.toggle(DARK_MODE_CLASS, theme === 'dark');
  }
}
