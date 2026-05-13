import {Routes} from '@angular/router';

const signInForm = () => import('./views/sign-in-form/sign-in-form').then(m => m.SignInForm);
const signUpForm = () => import('./views/sign-up-form/sign-up-form').then(m => m.SignUpForm);

/**
 * Routes configuration for the IAM bounded context in the presentation layer.
 */
export const iamRoutes: Routes = [
  { path: 'sign-in', loadComponent: signInForm},
  { path: 'sign-up', loadComponent: signUpForm}
];
