import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {IamStore} from '../../../application/iam.store';

/**
 * Component for handling authentication actions in the presentation layer of the IAM bounded context.
 */
@Component({
  selector: 'app-authentication-section',
  imports: [],
  templateUrl: './authentication-section.html',
})
export class AuthenticationSection {
  private router = inject(Router);
  protected store = inject(IamStore);

  /**
   * Navigates to the sign-in page.
   */
  performSignIn(){
    this.router.navigate(['/iam/sign-in']).then();
  }

  /**
   * Navigates to the sign-up page.
   */
  performSignUp(){
    this.router.navigate(['/iam/sign-up']).then();
  }

  /**
   * Signs out the current user.
   */
  performSignOut(){
    this.store.signOut(this.router);
  }
}
