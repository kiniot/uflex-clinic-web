import { Routes } from '@angular/router';

const exerciseCatalogManagement = () =>
  import('./views/exercise-catalog-management/exercise-catalog-management').then(
    (m) => m.ExerciseCatalogManagement,
  );
const exerciseCatalogForm = () =>
  import('./views/exercise-catalog-form/exercise-catalog-form').then((m) => m.ExerciseCatalogForm);

export const exerciseRoutes: Routes = [
  { path: '', loadComponent: exerciseCatalogManagement, data: { preload: true } },
  { path: 'new', loadComponent: exerciseCatalogForm },
  { path: ':exerciseId/edit', loadComponent: exerciseCatalogForm },
];
