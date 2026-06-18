import { Component, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-clinic-admin-profile-prompt-dialog',
  imports: [TranslatePipe, DialogModule, ButtonModule],
  templateUrl: './clinic-admin-profile-prompt-dialog.html',
  styleUrl: './clinic-admin-profile-prompt-dialog.scss',
})
export class ClinicAdminProfilePromptDialog {
  visible = model.required<boolean>();

  readonly complete = output<void>();
  readonly postpone = output<void>();

  protected onComplete() {
    this.complete.emit();
  }

  protected onPostpone() {
    this.visible.set(false);
    this.postpone.emit();
  }
}
