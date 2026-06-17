import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { toAppError } from './app-error.mapper';

/**
 * Abstract base class providing error handling utilities for infrastructure services.
 */
export abstract class ErrorHandlingEnabledBaseType {
  /**
   * Handles HTTP errors and returns an Observable that emits an error message.
   * @param operation - The name of the operation that failed.
   * @returns A function that takes an HttpErrorResponse and returns an Observable that emits an error message.
   * @protected
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      return throwError(() => toAppError(error, operation));
    };
  }
}
