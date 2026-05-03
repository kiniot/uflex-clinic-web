import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-theme-switcher',
  imports: [CommonModule, ButtonModule, Tooltip],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher implements OnInit {
  isDark: boolean = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.updateTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme() {
    const html = document.documentElement;
    if (this.isDark) {
      html.classList.add('app-dark');
    } else {
      html.classList.remove('app-dark');
    }
  }
}
