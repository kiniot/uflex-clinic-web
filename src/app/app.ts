import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Layout } from './shared/presentation/components/layout/layout';

const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('uflex-clinic-web');
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);

    const savedLanguage = localStorage.getItem('language');
    const initialLanguage: SupportedLanguage = this.isSupportedLanguage(savedLanguage)
      ? savedLanguage
      : 'en';

    document.documentElement.lang = initialLanguage;
    this.translate.use(initialLanguage);
  }

  private isSupportedLanguage(language: string | null): language is SupportedLanguage {
    return language === 'en' || language === 'es';
  }
}
