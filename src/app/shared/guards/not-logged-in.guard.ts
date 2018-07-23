import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserService } from '../services/user.service';

/**
 * This guard is applied when the user attempts to access the login page.  If the user happens
 * to be logged in already, then they are redirected to the Events page instead....
 */

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivate {
  constructor(private user: UserService,
              private router: Router) {}

  canActivate() {
    if (!this.user.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/events']);
      return false;
    }
  }
}

