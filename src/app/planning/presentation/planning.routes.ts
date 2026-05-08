import {Routes} from '@angular/router';

const therapyRoadmap = () =>
  import('./views/therapy-roadmap/therapy-roadmap').then(m => m.TherapyRoadmap);

/**
 * Routes for the Planning bounded context. The default view is the
 * Therapy Roadmap (the physiotherapist's primary planning workspace);
 * future views (program library, milestones, schedule builder) will
 * mount as siblings here.
 */
export const planningRoutes: Routes = [
  {path: '', loadComponent: therapyRoadmap}
];
