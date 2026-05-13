import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {SelectButtonModule} from 'primeng/selectbutton';

@Component({
  selector: 'app-language-switcher',
  imports: [FormsModule, SelectButtonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher {
  protected currentLang: string = 'en';

  /** Options consumed by p-selectButton (label shown, value used as lang code). */
  protected languageOptions = [
    {label: 'EN', value: 'en'},
    {label: 'ES', value: 'es'}
  ];

  /** Translation service instance */
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.currentLang = this.translate.getCurrentLang();
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   */
  useLanguage(language: string) {
    if (!language || language === this.currentLang) return;
    this.translate.use(language);
    this.currentLang = language;
  }
}
