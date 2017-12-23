import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import {Router} from '@angular/router';

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
import {UsersUrl} from './urls';
import {UsersThisInstitutionUrl} from './urls';
import {InstitutionsUrl} from './urls';

import {User} from '../models/user';

@Injectable()
export class UserService {

  jwtHelper: JwtHelper = new JwtHelper();

  currentUser: User = null;

  //private loggedIn = false;

  // Observable user source
  private userAnnouncedSource = new Subject<User>();

  // Observable user stream
  userAnnounced$ = this.userAnnouncedSource.asObservable();


  constructor(private http: Http,
              private router: Router) {
    //this.loggedIn = !!localStorage.getItem('auth_token');
  }

  register(username, password, email, firstName, lastName, institutionId): Observable<any> {
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
          'analyzed_events': emptyList,
          'institution_id': institutionId
        }),
        { headers }
      )
      .map(res => res.json());
  }

  login(username, password) {
    console.log('at login method');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        LoginUrl,
        JSON.stringify({ username, password }),
        { headers }
      )
      .map(res => {
        // apparently if there is an error, that just gets returned automatically(?), skipping over this part of the code
        let jsonResponse = res.json();
        console.log('here is the response: ', jsonResponse);
        localStorage.setItem('auth_token', jsonResponse.token);
        //this.loggedIn = true;
        return jsonResponse;
      })
  }

  tokenExpired() {
    let token: string = this.fetchToken();
    if (token === null) {
      return true;
    } else {
      let nowSeconds = Date.now()/1000;
      let decoded = this.jwtHelper.decodeToken(token);
      console.log('seconds remaining: ', decoded.exp - nowSeconds - 10);

      return !(decoded.exp > nowSeconds + 10);// add 10 seconds to be on the safe side
    }
  }

  setUserData(authToken: string) {
    let decoded = this.jwtHelper.decodeToken(authToken);//localStorage.getItem('auth_token'));
    let userID = decoded.user_id;
    let headers = new Headers();
    //let authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    // some useful information about map, etc.:
    // https://stackoverflow.com/questions/40029986/how-does-map-subscribe-on-angular2-work
    return this.http
      .get(
        UsersUrl + userID+"/",
        {headers}
      )
      .map(res => {
        let userData = res.json();
        this.currentUser = new User(userData);
        this.announceUser(this.currentUser);
        return userData;
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    //this.loggedIn = false;
    this.userAnnouncedSource.next(null);
    //this.announceLogOut();
  }

  fetchToken() {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn() {
    let loggedIn: boolean = !!localStorage.getItem('auth_token');
    return loggedIn;
  }

  currentUserDataIsSet() {
    return !(this.currentUser === null);
  }

  fetchUsers() {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    console.log('here is authToken:');
    console.log(authToken);

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    console.log(headers);
    console.log(EventTypeUrl);

    return this.http
      .get(
        UsersUrl,
        {headers}
      )
      .map(res => res.json());
  }

  fetchUsersThisInstitution() {
    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    console.log('here is authToken:');
    console.log(authToken);

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    console.log(headers);

    return this.http
      .get(
        UsersThisInstitutionUrl,
        {headers}
      )
      .map(res => res.json());

  }



  fetchUser(userId: number) {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    return this.http
      .get(
        UsersUrl+userId+'/',
        {headers}
      )
      .map(res => res.json());
  }


  // Service message command
  announceUser(user: User) {
    console.log('announcing user! or lack thereof....');
    //console.log(this.currentUser);
    this.userAnnouncedSource.next(user);
  }

  fetchInstitutions() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    console.log(headers);
    console.log(InstitutionsUrl);

    return this.http
      .get(
        InstitutionsUrl,
        {headers}
      )
      .map(res => res.json());
  }


}
