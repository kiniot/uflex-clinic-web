import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import {
  AppErrorMessageResolver,
  ResolveAppErrorMessageOptions,
  ResolvedAppErrorMessage,
} from './app-error-message-resolver';

export interface ShowHttpErrorOptions extends ResolveAppErrorMessageOptions {
  life?: number;
}

@Injectable({ providedIn: 'root' })
export class AppErrorNotifier {
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly resolver = inject(AppErrorMessageResolver);

  resolveMessage(
    error: unknown,
    options: ResolveAppErrorMessageOptions = {},
  ): ResolvedAppErrorMessage {
    return this.resolver.resolveMessage(error, options);
  }

  showHttpError(error: unknown, options: ShowHttpErrorOptions = {}): ResolvedAppErrorMessage {
    const resolved = this.resolveMessage(error, options);
    this.messageService.add({
      severity: resolved.severity,
      summary: this.translate.instant(resolved.summaryKey),
      detail: this.translate.instant(resolved.detailKey),
      life: options.life ?? 4500,
    });
    return resolved;
  }
}
