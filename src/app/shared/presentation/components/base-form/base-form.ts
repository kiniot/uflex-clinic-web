import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

/**
 * Base class for form components providing common form validation utilities in the presentation layer.
 */
export class BaseForm {
  /** Named distinctly from `translate` since most subclasses inject their own copy under that name. */
  private readonly baseFormTranslate = inject(TranslateService);

  /**
   * Checks if a form control is invalid and has been touched.
   * @param form - The form group containing the control.
   * @param controlName - The name of the control to check.
   * @returns True if the control is invalid and touched, false otherwise.
   * @protected
   */
  protected isInvalidControl(form: FormGroup, controlName: string): boolean {
    return form.controls[controlName].invalid && form.controls[controlName].touched;
  }

  /**
   * Generates an error message for a specific error key on a control. Messages are generic
   * (not control-specific) since raw control names like "dni" or "countryCode" aren't
   * user-friendly labels to interpolate into a sentence.
   * @param errorKey - The error key (e.g., 'required').
   * @returns The translated error message string.
   * @private
   */
  private errorMessageForControl(errorKey: string): string {
    switch (errorKey) {
      case 'required':
        return this.baseFormTranslate.instant('shared.validation.required');
      default:
        return this.baseFormTranslate.instant('shared.validation.invalid');
    }
  }

  /**
   * Retrieves all error messages for a form control.
   * @param form - The form group containing the control.
   * @param controlName - The name of the control.
   * @returns A concatenated string of error messages.
   * @protected
   */
  protected errorMessagesForControl(form: FormGroup, controlName: string): string {
    const control = form.controls[controlName];
    let errorMessages = '';
    const errors = control.errors;
    if (!errors) return errorMessages;
    Object.keys(errors).forEach(
      (errorKey) => (errorMessages += this.errorMessageForControl(errorKey)),
    );
    return errorMessages;
  }
}
