import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DemoDatabase } from './demo-database';
import { DEMO_ROUTES } from './demo-routes';

const API_BASE_PATH = new URL(environment.apiBaseUrl).pathname.replace(/\/$/, '');

/**
 * Resolves HTTP requests against the in-memory {@link DemoDatabase} instead of the network.
 * Matches on the URL's pathname (relative to `environment.apiBaseUrl`'s own path), so it works
 * regardless of what host `apiBaseUrl` happens to point at in a given static deployment.
 */
@Injectable({ providedIn: 'root' })
export class DemoRouter {
  private readonly db = inject(DemoDatabase);

  /** Returns `null` when no demo route recognizes the request — caller should let it fall through. */
  dispatch(request: HttpRequest<unknown>): Observable<HttpResponse<unknown>> | null {
    const url = new URL(request.urlWithParams, 'http://demo.local');
    if (!url.pathname.startsWith(API_BASE_PATH)) return null;

    const relativePath = url.pathname.slice(API_BASE_PATH.length) || '/';
    const route = DEMO_ROUTES.find(
      (candidate) => candidate.method === request.method && candidate.pattern.test(relativePath),
    );
    if (!route) return null;

    const match = relativePath.match(route.pattern);
    const params = { ...(match?.groups ?? {}) };

    try {
      const body = route.handler({
        db: this.db,
        params,
        query: url.searchParams,
        body: request.body,
      });
      return of(new HttpResponse({ status: 200, body: body ?? {}, url: request.urlWithParams }));
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: error.status,
              statusText: error.statusText,
              url: request.urlWithParams,
              error: error.error,
            }),
        ) as Observable<HttpResponse<unknown>>;
      }
      throw error;
    }
  }
}
