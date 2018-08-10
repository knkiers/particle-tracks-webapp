import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {MaterializeDirective,MaterializeAction} from "angular2-materialize";

import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit, OnDestroy {

  modalActions = new EventEmitter<string|MaterializeAction>();

  token: string = null;
  tokenReceived: boolean = false;
  private sub: any;

  resetPasswordServerError: any;

  public resetPasswordForm: FormGroup; // our model driven form

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.token = params['token'] || null;
        console.log('here is the token! ', this.token);
        if (this.token === null) {
          this.tokenReceived = false;
        } else {
          this.tokenReceived = true;
        }
      });
    this.initializeForm();
  }

  initializeForm(){
    this.resetPasswordForm = this.formBuilder.group({
      passwords: this.formBuilder.group({
        password: ['', [<any>Validators.required]],
        password2: ['', [<any>Validators.required]]
      }, {validator: this.areEqual})
    });

  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }

  userIsLoggedIn() {
    return this.userService.isLoggedIn();
  }

  signOut() {
    this.userService.logout();
  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  redirect() {
    this.router.navigate(['/']);
  }

  onSubmit() {

    if (this.resetPasswordForm.valid){
      this.resetPasswordServerError = null;//reinitialize it....
      this.userService.resetPasswordConfirm(
        this.token,
        this.resetPasswordForm.value.passwords.password,
      ).subscribe(
        (result) => {
          //console.log('here is the result! ', result);
          //this.router.navigate(['/login']);
          this.openModal();
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
