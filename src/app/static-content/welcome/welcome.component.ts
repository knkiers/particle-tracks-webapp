import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

//import {UserService} from '../../shared/services/user.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /*
  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  */

}
