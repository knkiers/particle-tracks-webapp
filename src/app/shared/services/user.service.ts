import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';

// See: https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450
// Note: at some point Http will be deprecated in favour of HttpClient....
// See: https://angular.io/guide/http
//import {HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import {Router} from '@angular/router';

import {Observable,  Subject, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

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
import {UserNumberEvents} from '../interfaces/user-number-events';

@Injectable()
export class UserService {

  //jwtHelper: JwtHelper = new JwtHelper();

  jwtHelper = new JwtHelperService();

  currentUser: User = null;

  //private loggedIn = false;

  // Observable user source
  private userAnnouncedSource = new Subject<User>();

  // Observable user stream
  userAnnounced$ = this.userAnnouncedSource.asObservable();


  constructor(private http: Http,
              //private httpClient: HttpClient,
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
      .pipe(
        map(res => res.json())
      );
  }

  update(username, email, firstName, lastName, institutionId, userId): Observable<any> {

    console.log('user id: ', userId);
    console.log('username: ', username);
    console.log('email: ', email);
    console.log('firstName: ', firstName);
    console.log('lastName: ', lastName);
    console.log('institutionId: ', institutionId);


    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    //headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    let emptyList = [];
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(
        AccountsUrl+userId+'/',
        JSON.stringify({
          'username': username,
          'password': 'password',
          'email': email,
          'first_name': firstName,
          'last_name': lastName,
          'analyzed_events': emptyList,
          'institution_id': institutionId
        }),
        { headers }
      )
      .pipe(
        map(res => res.json())
      );
  }

  login(username, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        LoginUrl,
        JSON.stringify({ username, password }),
        { headers })
      .pipe(
        map(res => {
        // apparently if there is an error, that just gets returned automatically(?), skipping over this part of the code
          let jsonResponse = res.json();
          sessionStorage.setItem('auth_token', jsonResponse.token);
          //this.loggedIn = true;
          return jsonResponse;
      })
      )
      ;
  }

  tokenExpired() {
    let token: string = this.fetchToken();
    if (token === null) {
      return true;
    } else {
      let nowSeconds = Date.now()/1000;
      let decoded = this.jwtHelper.decodeToken(token);

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
      .pipe(
        map(res => {
          let userData = res.json();
          this.currentUser = new User(userData);
          console.log('user data: ', userData);
          this.announceUser(this.currentUser);
          return userData;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    //this.loggedIn = false;
    this.userAnnouncedSource.next(null);
    //this.announceLogOut();
  }

  fetchToken() {
    return sessionStorage.getItem('auth_token');
  }

  isLoggedIn() {
    let loggedIn: boolean = !!sessionStorage.getItem('auth_token');
    return loggedIn;
  }

  isAdmin() {
    if (this.currentUser === null) {
      return false;
    } else {
      return this.currentUser.isStaff;
    }
  }


  currentUserDataIsSet() {
    return !(this.currentUser === null);
  }

  fetchCurrentUser() {
    if (this.currentUserDataIsSet()) {
      return this.currentUser;
    } else {
      return null;
    }
  }


  fetchUsers() {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    //https://stackoverflow.com/questions/45286764/angular-httpclient-doesnt-send-header

    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    //eventually will be required to switch to HttpClient; then this will be how to set the headers:
    //let headers = new HttpHeaders(); // this is the
    //headers = headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${authToken}`);

    return this.http
      .get(
        UsersUrl,
        {headers}
      )
      .pipe(
        map(res => res.json())
      );
  }

  fetchUsersThisInstitution() {
    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    // https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450

    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    //eventually will be required to switch to HttpClient; then this will be how to set the headers:
    //let headers = new HttpHeaders(); // this is the
    //headers = headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${authToken}`);

    //console.log(headers);

    return this.http
      .get(
        UsersThisInstitutionUrl,
        {headers: headers}
      )
      .pipe(
        map(res => res.json())
      );
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
    let authToken = sessionStorage.getItem('auth_token');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    return this.http
      .get(
        UsersUrl+userId+'/',
        {headers}
      )
      .pipe(
        map(res => res.json())
      );
  }


  // Service message command
  announceUser(user: User) {
    this.userAnnouncedSource.next(user);
  }

  fetchInstitutions() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this.http
      .get(
        InstitutionsUrl,
        {headers}
      )
      .pipe(
        map(res => res.json())
      );
  }


}
