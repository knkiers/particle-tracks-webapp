import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {User} from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userForm: FormGroup; // our model driven form

  editUsername: boolean = false;
  editEmail: boolean = false;
  editFirstName: boolean = false;
  editLastName: boolean = false;
  editInstitution: boolean = false;

  availableInstitutions: any = null;
  haveInstitutions: boolean = false;
  
  currentUser: User = null;
  signinServerError: any;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.fetchInstitutions();

    this.currentUser = this.userService.fetchCurrentUser();
    console.log('user: ', this.currentUser);
    if (this.currentUser !== null) {// if we already have the user....
      this.initializeForm();
    }

    // subscribe to userAnnounced$, just in case we don't have
    // the user in memory in the userService for some reason....
    this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        console.log('inside profile comp...user updated');
        this.initializeForm();
//        console.log(this.currentUser);
      });

  }

  fetchInstitutions() {
    this.userService.fetchInstitutions().subscribe(
      institutions => {
        console.log('institutions: ',institutions);
        this.availableInstitutions = institutions;
        this.haveInstitutions = true;
      },
      err => console.log("ERROR", err)
    );

  }

  initializeForm(){
    this.userForm = this.formBuilder.group({
      username: [this.currentUser.username, [<any>Validators.required]],
      email: [this.currentUser.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      //passwords: this.formBuilder.group({
      //  password: [this.userData.password, [<any>Validators.required]],
      //  password2: [this.userData.password, [<any>Validators.required]]
      //}, {validator: this.areEqual}),
      firstName: [this.currentUser.firstName, [<any>Validators.required]],
      lastName: [this.currentUser.lastName, [<any>Validators.required]],
      institutionId: [this.currentUser.institutionId, [<any>Validators.required]],
    });

    this.userForm.controls.username.disable();
    this.userForm.controls.email.disable();
    this.userForm.controls.firstName.disable();
    this.userForm.controls.lastName.disable();
    this.userForm.controls.institutionId.disable();

  }


  enableField(fieldName: string) {
    switch(fieldName) {
      case 'username': {
        this.userForm.controls.username.enable();
        this.editUsername = true;
        break;
      }
      case 'email': {
        this.userForm.controls.email.enable();
        this.editEmail = true;
        break;
      }
      case 'firstName': {
        this.userForm.controls.firstName.enable();
        this.editFirstName = true;
        break;
      }
    case 'lastName': {
        this.userForm.controls.lastName.enable();
        this.editLastName = true;
        break;
      }
    case 'institution': {
        this.userForm.controls.institutionId.enable();
        this.editInstitution = true;
        break;
      }
    }
  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }

  // if change this in this in the future, make sure to change it in the signup component as well....
  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  onSubmit() {

    console.log('currentUser: ', this.currentUser);

    if (this.userForm.valid){
      this.signinServerError = null;//reinitialize it....
      this.userService.update(
        this.editUsername?this.userForm.value.username:this.currentUser.username,
        //this.userForm.value.passwords.password,
        this.editEmail?this.userForm.value.email:this.currentUser.email,
        this.editFirstName?this.userForm.value.firstName:this.currentUser.firstName,
        this.editLastName?this.userForm.value.lastName:this.currentUser.lastName,
        this.editInstitution? +this.userForm.value.institutionId:this.currentUser.institutionId,
        this.currentUser.id
      ).subscribe(
        (result) => {
          //this.router.navigate(['/login']);
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









/*
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
  */

}
