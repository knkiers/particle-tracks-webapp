import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {MaterializeDirective/*,MaterializeAction*/} from "angular2-materialize";

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordServerError: any;

  public resetPasswordForm: FormGroup; // our model driven form

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([<any>Validators.required, this.emailValidator])],
    });

  }

  // if change this in this in the future, make sure to change it in the profile component as well....
  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  userIsLoggedIn() {
    return this.userService.isLoggedIn();
  }

  signOut() {
    this.userService.logout();
  }

  onSubmit() {
    if (this.resetPasswordForm.valid){
      this.resetPasswordServerError = null;//reinitialize it....
      this.userService.resetPassword(
        this.resetPasswordForm.value.email
      ).subscribe(
        (result) => {
          console.log('here is the result! ', result);
          //this.router.navigate(['/login']);
        },
        (error) => {

          console.log(error);
          //console.log(error.status);
          if (error.status >= 500) {
            this.resetPasswordServerError = error.statusText+': Most likely, there is no active user associated with this email address or the password cannot be changed.';
          } else if (error.status >= 400) {
            let errorDict = JSON.parse(error._body);
            for (var key in errorDict) {
              let message = errorDict[key];
              if (Array.isArray(message)) {
                this.resetPasswordServerError = message[0];//the text of the error is the only entry in an array....
              } else {
                this.resetPasswordServerError = message;
              }
              //console.log(errorDict[key]);
            }
          } else {
            this.resetPasswordServerError = error.statusText;
          }
        });
    }
  }


}
