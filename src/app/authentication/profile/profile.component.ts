import { Component, OnInit } from '@angular/core';

import {User} from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User = null;
  signinServerError: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.fetchCurrentUser();
    console.log('user: ', this.currentUser);
  }

  updateUser() {
    this.userService.update(
      'newUser39Edited',
      'newEmailEdited@example.com',
      'KenEdited',
      'KiersEdited'
    ).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        let errorDict = JSON.parse(error._body);
        console.log('there was an error');
        console.log(errorDict);
        // if there are multiple errors, only the last one will be shown;
        // this will allow the user to fix one error at a time, which isn't so bad....
        for (var key in errorDict) {
          this.signinServerError = errorDict[key][0];//the text of the error is the only entry in an array....
          console.log(errorDict[key]);
        }
      });
  }

}
