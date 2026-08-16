import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preloads the main navigation of the active portal without eagerly loading
 * detail, form, and workspace routes that are only needed on demand.
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  private readonly router = inject(Router);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['preloadPortal'] === true) {
      return this.isActivePortal(route) ? load() : of(null);
    }

    return route.data?.['preload'] === true ? load() : of(null);
  }

  private isActivePortal(route: Route): boolean {
    const portalPath = route.path;

    return Boolean(
      portalPath &&
        (this.router.url === `/${portalPath}` || this.router.url.startsWith(`/${portalPath}/`)),
    );
  }
}
