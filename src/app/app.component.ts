import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';

import { UserService } from './shared/services/user.service';

import {EventDisplayService} from './shared/services/event-display.service';
import {UnitConversionService} from './shared/services/unit-conversion.service';
import {EventAnalysisService} from './shared/services/event-analysis.service';

import { CircleBindingService } from './end-user/circle-binding.service';

import {User} from './shared/models/user';

//import { UserService } from './shared/services/user.service';
//import { LoggedInGuard } from './shared/guards/logged-in.guard';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

// will eventually need to upgrade to RC5+ (currently at RC6):
// https://angular.io/docs/ts/latest/cookbook/rc4-to-rc5.html

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    //UserService,
    EventDisplayService,
    UnitConversionService,
    EventAnalysisService,
    CircleBindingService//,
    //LoggedInGuard
  ]
})
export class AppComponent implements OnInit {

  currentUser: User = null;

  constructor(
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    // grab current user info if it exists....
    if (this.userService.isLoggedIn()){
      //this.currentUser = this.userService.getCurrentUser();
      console.log('inside ngOnInit, and the user is logged in already');
      // make sure we haven't lost the user's information for some reason; if so, refetch it....
      if (!this.userService.currentUserDataIsSet()) {
        let token = this.userService.fetchToken();
        if (token !== null && !(this.userService.tokenExpired())) {
          this.userService.setUserData(token).subscribe(
            result => {
              console.log('user is logged in and ready to go');
            }
          )
        }


      }
    } else {
      console.log('inside ngOnInit, and the user is not logged in yet');
      //console.log(this.currentUser);
    }
    // ...and sign up for the service in order to keep up with changes
    this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        console.log('inside app comp...user updated');
//        console.log(this.currentUser);
      });
    /*
     if(this.isLoggedIn()) {
     //this.currentUserName = this.user.currentUser.fullName();
     console.log()
     }
     */
  }

  isLoggedIn(){
    return this.userService.isLoggedIn();
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
