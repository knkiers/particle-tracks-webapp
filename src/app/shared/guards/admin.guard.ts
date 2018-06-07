import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private user: UserService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.user.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
