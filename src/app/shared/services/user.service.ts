import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Subject }    from 'rxjs/Subject';
import { JwtHelper } from 'angular2-jwt';
// NOTE: only using angular2-jwt to decode the jwt; in principle this package could
//       be used much more extensively

//import localStorage from 'localStorage';

// useful authentication resource:
// https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.swnprx2cf

import {EventTypeUrl} from './urls';
import {LoginUrl} from './urls';
import {AccountsUrl} from './urls';


@Injectable()
export class UserService {

  jwtHelper: JwtHelper = new JwtHelper();
  decoded: any;
  userID: any;

  private loggedIn = false;

  // Observable user source
  private userAnnouncedSource = new Subject<any>();

  // Observable user stream
  userAnnounced$ = this.userAnnouncedSource.asObservable();


  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  register(username, password, email, firstName, lastName): Observable<any> {
    let headers = new Headers();
    let emptyList = [];
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
        AccountsUrl,
        JSON.stringify({
          'username': username,
          'password': password,
          'email': email,
          'first_name': firstName,
          'last_name': lastName,
          'analyzed_events': emptyList
        }),
        { headers }
      )
      .map(res => res.json());
  }

  login(username, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    /*
     WORKING HERE...
     to do next:
     - add the ability to save and retrieve events
     */
    return this.http
      .post(
        LoginUrl,
        JSON.stringify({ username, password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log('inside user service');
        console.log(res);
        localStorage.setItem('auth_token', res.token);
        this.loggedIn = true;
        this.announceUser(username);
        console.log(localStorage.getItem('auth_token'));
        this.decoded = this.jwtHelper.decodeToken(localStorage.getItem('auth_token'));
        console.log(this.decoded);
        this.userID = this.decoded.user_id;
        console.log(this.userID);

        // TODO:
        // probably after getting the token, should go back and get all
        // of the user's data, so can create a User object...it's kind of
        // hinky to take the typed-in username as the user's name...plus we
        // lose it if the page gets refreshed....

      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
    this.userAnnouncedSource.next(null);
    //this.announceLogOut();
  }

  fetchUserID() {
    return this.userID;
  }


  isLoggedIn() {
    return this.loggedIn;
  }

  // Service message command
  announceUser(username) {
    console.log('announcing user! or lack thereof....');
    //console.log(this.currentUser);
    this.userAnnouncedSource.next(username);
  }

}
