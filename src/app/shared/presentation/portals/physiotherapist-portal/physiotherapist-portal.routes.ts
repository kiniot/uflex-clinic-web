import {Routes} from '@angular/router';

const portal = () =>
  import('./physiotherapist-portal').then(m => m.PhysiotherapistPortal);

/**
 * Physiotherapist portal routes. Currently a placeholder; will gain its own
 * shell + bounded-context composition once the role's mockups are designed.
 */
export const physiotherapistPortalRoutes: Routes = [
  {path: '', loadComponent: portal}
];
