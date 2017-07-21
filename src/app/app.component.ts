import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';

import {EventDisplayService} from './shared/services/event-display.service';
import {UnitConversionService} from './shared/services/unit-conversion.service';
import {EventAnalysisService} from './shared/services/event-analysis.service';

import { CircleBindingService } from './end-user/circle-binding.service';


import {Router} from '@angular/router';

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

  currentUser: any; // TODO: construct a User object(!)

  constructor(
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    // grab current user info if it exists....
    if (this.userService.isLoggedIn()){
      //this.currentUser = this.userService.getCurrentUser();
      console.log('inside ngOnInit, and the user is logged in already');
      // WORKING HERE:
      // - after creating a user object, will just get it (as above), and then
      //   will have access to the user's name, etc.
      //console.log(this.currentUser);
    } else {
      console.log('inside ngOnInit, and the user is not logged in yet');
      //console.log(this.currentUser);
    }
    // ...and sign up for the service in order to keep up with changes
    this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        console.log('inside app comp...user updated');
        console.log(this.currentUser);
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
