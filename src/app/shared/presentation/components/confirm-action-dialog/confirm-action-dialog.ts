import { Component, input, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

type ConfirmActionTone = 'primary' | 'danger';

@Component({
  selector: 'app-confirm-action-dialog',
  imports: [TranslatePipe, DialogModule, ButtonModule],
  templateUrl: './confirm-action-dialog.html',
  styleUrl: './confirm-action-dialog.scss',
})
export class ConfirmActionDialog {
  visible = model.required<boolean>();

  readonly titleKey = input.required<string>();
  readonly messageKey = input.required<string>();
  readonly titleParams = input<Record<string, string | number> | undefined>();
  readonly messageParams = input<Record<string, string | number> | undefined>();
  readonly confirmLabelKey = input.required<string>();
  readonly cancelLabelKey = input<string>('shared.confirmAction.cancel');
  readonly iconClass = input<string>('pi pi-question-circle');
  readonly tone = input<ConfirmActionTone>('primary');
  readonly pending = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected onConfirm() {
    if (this.pending()) return;
    this.confirmed.emit();
  }

  protected onHide() {
    this.closed.emit();
  }
}
