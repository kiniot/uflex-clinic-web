import {computed, Injectable, signal} from '@angular/core';
import {User} from '../domain/model/user.entity';
import {SignInCommand} from '../domain/model/sign-in.command';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignUpCommand} from '../domain/model/sign-up.command';

/**
 * Application service store for managing Identity and Access Management state in the IAM bounded context.
 * Handles user authentication, sign-in, sign-up, and user data.
 */
@Injectable({providedIn: 'root'})
export class IamStore {
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<Array<User>>([]);

  /**
   * Readonly signal indicating if the user is signed in.
   */
  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  /**
   * Signal indicating if users are being loaded.
   */
  readonly loadingUsers = signal<boolean>(false);

  /**
   * Readonly signal for the current username.
   */
  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  /**
   * Readonly signal for the current user ID.
   */
  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /**
   * Computed signal for the current authentication token.
   */
  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);

  /**
   * Readonly signal for the list of users.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal indicating if users are loading.
   */
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  /**
   * Creates an instance of IamStore.
   * @param iamApi The IAM API service.
   */
  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  /**
   * Signs in a user with the provided credentials.
   * @param signInCommand The sign-in command.
   * @param router The router for navigation.
   */
  signIn(signInCommand: SignInCommand, router: Router) {
    console.log(signInCommand);
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(signInResource.username);
        this.currentUserIdSignal.set(signInResource.id);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/iam/sign-in']).then();
      }
    });
  }

  /**
   * Signs up a new user.
   * @param signUpCommand The sign-up command.
   * @param router The router for navigation.
   */
  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/iam/sign-up']).then();
      }
    });
  }

  /**
   * Signs out the current user.
   * @param router The router for navigation.
   */
  signOut(router: Router) {
    localStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    router.navigate(['/iam/sign-in']).then();
  }
}
