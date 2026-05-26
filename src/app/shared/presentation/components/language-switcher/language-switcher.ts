import {Component, OnInit, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {SelectButtonModule} from 'primeng/selectbutton';

type SupportedLanguage = 'en' | 'es';

@Component({
  selector: 'app-language-switcher',
  imports: [FormsModule, SelectButtonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher implements OnInit {
  protected currentLang: SupportedLanguage = 'en';

  /** Options consumed by p-selectButton (label shown, value used as lang code). */
  protected languageOptions = [
    {label: 'EN', value: 'en'},
    {label: 'ES', value: 'es'}
  ];

  /** Translation service instance */
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
  }

  ngOnInit() {
    const currentLanguage = this.translate.getCurrentLang();
    this.currentLang = this.isSupportedLanguage(currentLanguage) ? currentLanguage : 'en';
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   */
  useLanguage(language: SupportedLanguage) {
    if (!language || language === this.currentLang) return;
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    this.translate.use(language);
    this.currentLang = language;
  }

  private isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return language === 'en' || language === 'es';
  }
}
