import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IamStore } from '../../../iam/application/iam.store';

export class MissingSubscriptionTokenError extends Error {
  constructor() {
    super('Missing authentication token.');
  }
}

export class MissingSubscriptionTenantError extends Error {
  constructor() {
    super('Missing tenant id.');
  }
}

interface JwtPayload {
  sub?: string;
  email?: string;
}

/**
 * Resolves the clinic tenant for Subscription without duplicating IAM login state.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionTenantContextService {
  private readonly http = inject(HttpClient);
  private readonly iamStore = inject(IamStore);
  private readonly usersUrl = `${environment.apiBaseUrl}/users`;

  resolveClinicId(): Observable<string> {
    const token = this.iamStore.currentToken();
    if (!token) {
      return throwError(() => new MissingSubscriptionTokenError());
    }

    const email = this.iamStore.currentEmail() ?? this.emailFromToken(token);
    if (!email) {
      return throwError(() => new MissingSubscriptionTenantError());
    }

    return this.http.get<unknown>(`${this.usersUrl}/${encodeURIComponent(email)}`).pipe(
      map((response) => extractTenantId(response)),
      map((tenantId) => {
        if (!tenantId) {
          throw new MissingSubscriptionTenantError();
        }

        return tenantId;
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return throwError(() => new MissingSubscriptionTenantError());
        }

        return throwError(() => error);
      }),
    );
  }

  private emailFromToken(token: string): string | null {
    try {
      const payload = decodeJwtPayload(token);
      return payload?.email ?? payload?.sub ?? null;
    } catch {
      return null;
    }
  }
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const base64 = token.split('.')[1];
  if (!base64) return null;

  const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '=='.slice(0, (4 - (normalized.length % 4)) % 4);
  const json = decodeURIComponent(
    atob(padded)
      .split('')
      .map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(json) as JwtPayload;
}

function extractTenantId(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null;

  const record = response as Record<string, unknown>;
  const data = record['data'];

  return (
    stringValue(record, 'tenantId') ??
    stringValue(record, 'tenant_id') ??
    stringValue(record, 'clinicId') ??
    stringValue(record, 'clinic_id') ??
    // TODO: Replace this compatibility fallback once IAM/Organization exposes tenantId reliably.
    stringValue(record, 'id') ??
    (data && typeof data === 'object' ? extractTenantId(data) : null)
  );
}

function stringValue(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}
