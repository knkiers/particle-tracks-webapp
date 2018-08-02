import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {Subscription} from 'rxjs';

import {User} from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import {UpdateUserData} from '../../shared/interfaces/update-user-data';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public userForm: FormGroup; // our model driven form

  editUsername: boolean = false;
  editEmail: boolean = false;
  editFirstName: boolean = false;
  editLastName: boolean = false;
  editInstitution: boolean = false;
  editPassword: boolean = false;

  availableInstitutions: any = null;
  haveInstitutions: boolean = false;
  showInstitutionDropDown: boolean = false;//set to true if user is _not_ staff (staff users cannot change their institution....)

  currentUser: User = null;
  updateServerError: any;


  private subscription: Subscription;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router) {
    // subscribe to userAnnounced$, just in case we don't have
    // the user in memory in the userService for some reason....
    this.subscription = this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        //console.log('inside profile comp...user updated');
        if (this.currentUser !== null) {// if we already have the user....
          this.initializeForm();
        }
      });
  }

  ngOnInit() {
    this.fetchInstitutions();
    this.currentUser = this.userService.fetchCurrentUser();
    console.log('user: ', this.currentUser);
    if (this.currentUser !== null) {// if we already have the user....
      this.initializeForm();
    }
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
    if (this.currentUser.isStaff === false) {
      this.showInstitutionDropDown = true; //only allow non-staff to change institutions
    }
    this.userForm = this.formBuilder.group({
      username: [this.currentUser.username, [<any>Validators.required]],
      email: [this.currentUser.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: ['', [<any>Validators.required]],
        password2: ['', [<any>Validators.required]]
      }, {validator: this.areEqual}),
      firstName: [this.currentUser.firstName, [<any>Validators.required]],
      lastName: [this.currentUser.lastName, [<any>Validators.required]],
      institutionId: [this.currentUser.institutionId, [<any>Validators.required]],
    });

    this.userForm.controls.username.disable();
    this.userForm.controls.email.disable();
    this.userForm.controls.firstName.disable();
    this.userForm.controls.lastName.disable();
    this.userForm.controls.institutionId.disable();
    this.userForm.controls.passwords.disable();

  }


  // https://netbasal.com/disabling-form-controls-when-working-with-reactive-forms-in-angular-549dd7b42110
  enableField(fieldName: string) {
    switch(fieldName) {
      case 'username': {
        this.userForm.controls.username.enable();
        this.editUsername = true;
        break;
      }
      case 'password': {
        this.userForm.controls.passwords.enable();
        //this.userForm.controls.passwords.controls.password2.enable();
        this.editPassword = true;
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
    if (this.userForm.valid){
      let updateUserData: UpdateUserData = {};
      if (this.editUsername) {
        updateUserData.username = this.userForm.value.username;
      }
      if (this.editPassword) {
        updateUserData.password = this.userForm.value.passwords.password;
      }
      if (this.editEmail) {
        updateUserData.email = this.userForm.value.email;
      }
      if (this.editFirstName) {
        updateUserData.first_name = this.userForm.value.firstName;
      }
      if (this.editLastName) {
        updateUserData.last_name = this.userForm.value.lastName;
      }
      if (this.editInstitution) {
        updateUserData.institution_id = +this.userForm.value.institutionId;
      }

      console.log(updateUserData);

      this.updateServerError = null;//reinitialize it....
      this.userService.update(updateUserData,this.currentUser.id).subscribe(
        (result) => {
          //this.router.navigate(['/login']);
          // we receive back a new token after updating the user and by this point
          // it has already been stored; now we just need to update the
          // user's data in the user service....
          console.log('successfully updated user: ',result);
          this.userService.setUserData(result.token).subscribe(
            result => {
              this.router.navigate(['/events']);
            }
          );

        },
        (error) => {
          console.log(error);
          //console.log(error.status);
          if (error.status >= 500) {
            this.updateServerError = error.statusText;
          } else if (error.status >= 400) {
            let errorDict = JSON.parse(error._body);
            for (var key in errorDict) {
              let message = errorDict[key];
              if (Array.isArray(message)) {
                this.updateServerError = message[0];//the text of the error is the only entry in an array....
              } else {
                this.updateServerError = message;
              }
              //console.log(errorDict[key]);
            }
          } else {
            this.updateServerError = error.statusText;
          }
        });
    }

  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


}
